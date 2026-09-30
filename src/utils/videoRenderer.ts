import { VideoStoryboard, StickerOverlay } from '../types';
import { createSynthAudioTrack } from './audio';

export interface RenderProgress {
  progress: number; // 0 to 100
  message: string;
}

export async function renderStoryboardToVideo(
  storyboard: VideoStoryboard,
  stickers: StickerOverlay[] = [],
  aspectRatio: string = '9:16',
  onProgress?: (info: RenderProgress) => void
): Promise<{ blobUrl: string; format: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      // Determine canvas dimensions
      let width = 1080;
      let height = 1920;
      if (aspectRatio === '1:1') {
        height = 1080;
      } else if (aspectRatio === '4:5') {
        height = 1350;
      } else if (aspectRatio === '16:9') {
        width = 1920;
        height = 1080;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context creation failed');
      }

      // Preload images / videos for scenes
      onProgress?.({ progress: 10, message: 'Loading media frames & pre-rendering assets...' });

      const loadedImages: Map<string, HTMLImageElement> = new Map();
      for (const scene of storyboard.scenes) {
        if (!loadedImages.has(scene.mediaUrl)) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = scene.mediaUrl;
          await new Promise((res) => {
            img.onload = () => res(true);
            img.onerror = () => res(false);
          });
          loadedImages.set(scene.mediaUrl, img);
        }
      }

      // Setup Synth BGM Track
      const totalDuration = storyboard.totalDuration || 10;
      const audioTrack = createSynthAudioTrack(
        totalDuration,
        storyboard.bpm || 110,
        storyboard.musicMood || 'chill'
      );

      // Setup Canvas Stream & MediaRecorder
      const canvasStream = canvas.captureStream(30); // 30 FPS
      if (audioTrack.destination.stream.getAudioTracks().length > 0) {
        canvasStream.addTrack(audioTrack.destination.stream.getAudioTracks()[0]);
      }

      let mimeType = 'video/webm;codecs=vp9';
      let formatExt = 'webm';
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
        mimeType = 'video/mp4;codecs=h264';
        formatExt = 'mp4';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
        formatExt = 'mp4';
      }

      const mediaRecorder = new MediaRecorder(canvasStream, { mimeType });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        audioTrack.stop();
        const blob = new Blob(chunks, { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        resolve({ blobUrl, format: formatExt });
      };

      mediaRecorder.start();

      // Render Loop over scenes
      const fps = 30;
      const totalFrames = Math.floor(totalDuration * fps);
      let currentFrame = 0;

      const renderInterval = setInterval(() => {
        currentFrame++;
        const currentSec = currentFrame / fps;
        const progressPct = Math.min(95, Math.floor((currentFrame / totalFrames) * 100));

        onProgress?.({
          progress: progressPct,
          message: `Rendering scene ${Math.min(
            storyboard.scenes.length,
            Math.ceil((currentSec / totalDuration) * storyboard.scenes.length)
          )} of ${storyboard.scenes.length}...`,
        });

        // Find active scene based on time
        let accumulatedTime = 0;
        let activeScene = storyboard.scenes[0];
        let sceneTime = 0;

        for (const scene of storyboard.scenes) {
          if (currentSec >= accumulatedTime && currentSec <= accumulatedTime + scene.duration) {
            activeScene = scene;
            sceneTime = currentSec - accumulatedTime;
            break;
          }
          accumulatedTime += scene.duration;
        }

        // Clear canvas
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, width, height);

        // Draw Media
        const img = loadedImages.get(activeScene.mediaUrl);
        if (img) {
          const progress = Math.min(1, sceneTime / Math.max(1, activeScene.duration));
          let scale = 1.0;
          let offsetX = 0;
          let offsetY = 0;

          if (activeScene.motion === 'zoom-in') {
            scale = 1.0 + progress * 0.15;
          } else if (activeScene.motion === 'zoom-out') {
            scale = 1.15 - progress * 0.15;
          } else if (activeScene.motion === 'pan-left') {
            offsetX = -progress * 40;
          } else if (activeScene.motion === 'pan-right') {
            offsetX = progress * 40;
          }

          ctx.save();
          ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
          ctx.scale(scale, scale);

          // Draw aspect fill image
          const imgAspect = img.width / img.height;
          const canvasAspect = width / height;
          let drawW = width;
          let drawH = height;

          if (imgAspect > canvasAspect) {
            drawW = height * imgAspect;
          } else {
            drawH = width / imgAspect;
          }

          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
        }

        // Draw Text Overlay if active in scene
        if (activeScene.textOverlay?.content) {
          ctx.save();
          ctx.font = 'bold 48px "Bagel Fat One", sans-serif';
          ctx.fillStyle = '#F7C948';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;

          const textY =
            activeScene.textOverlay.position === 'top'
              ? height * 0.2
              : activeScene.textOverlay.position === 'bottom'
              ? height * 0.8
              : height * 0.5;

          ctx.fillText(activeScene.textOverlay.content, width / 2, textY);
          ctx.restore();
        }

        // Draw Draggable Overlay Stickers
        for (const st of stickers) {
          ctx.save();
          const posX = (st.x / 100) * width;
          const posY = (st.y / 100) * height;

          ctx.translate(posX, posY);
          ctx.rotate((st.rotation * Math.PI) / 180);
          ctx.scale(st.scale, st.scale);

          // Sticker background pill
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 4;
          ctx.font = 'bold 36px "DM Sans", sans-serif';

          const textMetrics = ctx.measureText(st.content);
          const pWidth = textMetrics.width + 30;
          const pHeight = 60;

          ctx.beginPath();
          if (typeof (ctx as any).roundRect === 'function') {
            (ctx as any).roundRect(-pWidth / 2, -pHeight / 2, pWidth, pHeight, 25);
          } else {
            ctx.rect(-pWidth / 2, -pHeight / 2, pWidth, pHeight);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(st.content, 0, 0);

          ctx.restore();
        }

        if (currentFrame >= totalFrames) {
          clearInterval(renderInterval);
          mediaRecorder.stop();
        }
      }, 1000 / fps);
    } catch (error: any) {
      console.error('Error rendering canvas video:', error);
      reject(error);
    }
  });
}
