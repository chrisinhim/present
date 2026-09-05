import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';
import { MediaFileItem } from '../../../models/presentation.models';

@Component({
  selector: 'app-media-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-4">
      <!-- LOADED MEDIA LIST WITH UPLOAD TILE AS FIRST ITEM -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
            Media Files ({{ state.mediaFiles().length }})
          </span>
          <span class="text-[10px] text-slate-500"
            >Supports JPG, PNG, GIF, MP4, WebM (IndexedDB offline)</span
          >
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-72 overflow-y-auto p-1"
        >
          <!-- 1. COMPACT FIRST TILE: DRAG & DROP / UPLOAD -->
          <div
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
            class="relative rounded-xl border-2 border-dashed border-slate-700 hover:border-sky-500 bg-slate-950/40 hover:bg-sky-950/20 p-2 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all min-h-[120px] text-center group"
          >
            <input
              #fileInput
              type="file"
              multiple
              accept="image/*,video/*"
              (change)="onFileSelected($event)"
              class="hidden"
            />

            <div
              class="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 group-hover:border-sky-500 flex items-center justify-center text-lg transition-colors"
            >
              ➕
            </div>

            <div class="flex flex-col items-center">
              <span class="text-xs font-bold text-slate-200 group-hover:text-sky-400"
                >Upload Media</span
              >
              <span class="text-[10px] text-slate-500 leading-tight">Drag &amp; drop or click</span>
            </div>
          </div>

          <!-- 2. MEDIA ITEMS TILES -->
          @for (item of state.mediaFiles(); track item) {
            <div
              (click)="selectMedia(item)"
              [ngClass]="
                state.background().mediaUrl === item.dataUrl
                  ? 'border-sky-500 bg-sky-950/40 ring-1 ring-sky-400'
                  : 'border-slate-800 bg-slate-900/60'
              "
              class="relative rounded-xl border p-2 flex flex-col gap-1.5 cursor-pointer hover:border-slate-700 transition-all group"
            >
              <!-- THUMBNAIL PREVIEW -->
              <div
                class="w-full h-20 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center"
              >
                @if (item.type === 'image') {
                  <img [src]="item.dataUrl" class="w-full h-full object-cover" alt="Thumbnail" />
                }
                @if (item.type === 'video') {
                  <video [src]="item.dataUrl" muted class="w-full h-full object-cover"></video>
                }
              </div>
              <!-- DETAILS -->
              <div class="flex items-center justify-between text-[11px]">
                <span
                  class="font-medium text-slate-300 truncate max-w-[80px]"
                  [title]="item.name"
                  >{{ item.name }}</span
                >
                <span class="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-400">{{
                  item.type
                }}</span>
              </div>
              <!-- DELETE BUTTON -->
              <button
                (click)="deleteMedia(item.id, $event)"
                title="Delete"
                class="absolute top-1 right-1 w-5 h-5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-full text-[10px] hidden group-hover:flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          }
        </div>
      </div>

      <!-- VIDEO PLAYER CONTROLS (Active when a video is selected/presented) -->
      @if (state.background().type === 'video' && state.background().mediaUrl) {
        <div
          class="flex flex-col gap-2 p-3 bg-slate-950/80 rounded-xl border border-sky-500/30 shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-sky-400">🎬 Video Controls</span>
              <span class="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">{{
                state.background().mediaName || 'Active Video'
              }}</span>
            </div>
            <!-- Looping Checkbox -->
            <label
              class="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer hover:text-white transition-colors select-none"
            >
              <input
                type="checkbox"
                [ngModel]="state.videoLoop()"
                (ngModelChange)="onLoopChange($event)"
                class="rounded bg-slate-800 border-slate-700 text-sky-600 focus:ring-sky-500"
              />
              <span class="font-medium">🔁 Loop Video</span>
            </label>
          </div>
          <!-- Video Scrubber & Playback Buttons -->
          <div class="flex items-center gap-3">
            <!-- Play / Pause Button -->
            <button
              (click)="state.toggleVideoPlay()"
              [title]="state.videoPlaying() ? 'Pause Video' : 'Play Video'"
              class="w-8 h-8 rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow transition-colors"
            >
              {{ state.videoPlaying() ? '⏸' : '▶' }}
            </button>
            <!-- Current Time / Duration -->
            <span class="text-xs font-mono text-slate-300 w-24 text-center">
              {{ formatTime(state.videoCurrentTime()) }} / {{ formatTime(state.videoDuration()) }}
            </span>
            <!-- Seek Scrubber -->
            <input
              type="range"
              min="0"
              [max]="state.videoDuration() || 100"
              step="0.1"
              [ngModel]="state.videoCurrentTime()"
              (ngModelChange)="onSeekChange($event)"
              class="flex-1 accent-sky-500 h-1.5 cursor-pointer"
            />
            <!-- Mute / Unmute Toggle -->
            <button
              (click)="state.toggleVideoMute()"
              [title]="state.videoMuted() ? 'Unmute Audio' : 'Mute Audio'"
              class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
            >
              <span>{{ state.videoMuted() ? '🔇' : '🔊' }}</span>
              <span>{{ state.videoMuted() ? 'Muted' : 'Sound' }}</span>
            </button>
          </div>
        </div>
      }

      <!-- MEDIA SCALING OPTIONS & ACTION BUTTON -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <!-- Scale Mode Toggle (Fit, Fill, Original) -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-400">Scale Mode:</span>
          <div class="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              (click)="setScaleMode('fit')"
              [ngClass]="
                state.mediaScaleMode() === 'fit'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              "
              title="Fit: Scale to fit full screen without cropping"
              class="px-3 py-1 text-xs rounded transition-colors"
            >
              Fit
            </button>
            <button
              (click)="setScaleMode('fill')"
              [ngClass]="
                state.mediaScaleMode() === 'fill'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              "
              title="Fill: Expand to fill screen completely (may crop edges)"
              class="px-3 py-1 text-xs rounded transition-colors"
            >
              Fill
            </button>
            <button
              (click)="setScaleMode('original')"
              [ngClass]="
                state.mediaScaleMode() === 'original'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              "
              title="Original: Display actual resolution without stretching"
              class="px-3 py-1 text-xs rounded transition-colors"
            >
              Original
            </button>
          </div>
        </div>

        <!-- ACTION BUTTON -->
        <div class="flex justify-end gap-2">
          <button
            (click)="presentMedia()"
            [disabled]="!state.background().mediaUrl"
            class="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-sm transition-colors shadow-lg"
          >
            Present Media
          </button>
        </div>
      </div>
    </div>
  `,
})
export class MediaPanelComponent {
  state = inject(PresentationStateService);

  onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  async onDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      this.handleFiles(e.dataTransfer.files);
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  private async handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await this.state.addMediaFile(file);
    }
  }

  selectMedia(item: MediaFileItem) {
    this.state.background.set({
      type: item.type === 'video' ? 'video' : 'picture',
      color: '#000000',
      mediaUrl: item.dataUrl || '',
      mediaName: item.name,
    });
  }

  deleteMedia(id: string, e: Event) {
    e.stopPropagation();
    this.state.removeMediaFile(id);
  }

  onLoopChange(loop: boolean) {
    this.state.setVideoLoop(loop);
  }

  onSeekChange(time: number) {
    this.state.seekVideo(Number(time));
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  setScaleMode(mode: 'fit' | 'fill' | 'original') {
    this.state.mediaScaleMode.set(mode);
    if (this.state.isPresented() && this.state.activeContent().type === 'MEDIA') {
      this.state.activeContent.update((c) => ({
        ...c,
        mediaScaleMode: mode,
      }));
      this.state.broadcastSync();
    }
  }

  presentMedia() {
    this.state.present({
      type: 'MEDIA',
      mediaUrl: this.state.background().mediaUrl,
      mediaType: this.state.background().type === 'video' ? 'video' : 'image',
      mediaScaleMode: this.state.mediaScaleMode(),
      videoLoop: this.state.videoLoop(),
      videoPlaying: this.state.videoPlaying(),
      videoMuted: this.state.videoMuted(),
    });
  }
}
