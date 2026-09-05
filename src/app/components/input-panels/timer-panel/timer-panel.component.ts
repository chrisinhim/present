import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationStateService } from '../../../services/presentation-state.service';

@Component({
  selector: 'app-timer-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-4">
      <!-- SUBTABS: TIME NOW / COUNTDOWN / POMODORO -->
      <div class="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          (click)="selectSubtab('time-now')"
          [ngClass]="
            activeSubtab() === 'time-now'
              ? 'bg-sky-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          "
          class="px-4 py-1.5 rounded-lg text-xs transition-colors"
        >
          🕒 Time Now (Clock)
        </button>
        <button
          (click)="selectSubtab('countdown')"
          [ngClass]="
            activeSubtab() === 'countdown'
              ? 'bg-sky-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          "
          class="px-4 py-1.5 rounded-lg text-xs transition-colors"
        >
          ⏳ Countdown (Target HH:MM)
        </button>
        <button
          (click)="selectSubtab('pomodoro')"
          [ngClass]="
            activeSubtab() === 'pomodoro'
              ? 'bg-sky-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          "
          class="px-4 py-1.5 rounded-lg text-xs transition-colors"
        >
          ⏱️ Pomodoro (Duration MM:SS)
        </button>
      </div>

      <!-- TIME NOW CONTENT -->
      @if (activeSubtab() === 'time-now') {
        <div class="flex flex-col gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
          <div class="flex items-center gap-4">
            <label
              class="text-xs text-slate-400 font-medium flex items-center gap-2 cursor-pointer"
            >
              <input type="radio" name="clockFormat" [(ngModel)]="clockFormat" value="12" />
              12-Hour (AM/PM)
            </label>
            <label
              class="text-xs text-slate-400 font-medium flex items-center gap-2 cursor-pointer"
            >
              <input type="radio" name="clockFormat" [(ngModel)]="clockFormat" value="24" />
              24-Hour
            </label>
          </div>
          <div class="text-3xl font-mono font-bold text-sky-400 py-2">
            {{ currentTimeString() }}
          </div>
        </div>
      }

      <!-- COUNTDOWN TARGET CONTENT -->
      @if (activeSubtab() === 'countdown') {
        <div class="flex flex-col gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
          <div class="flex items-center gap-2 text-xs text-slate-300">
            <span>Target Time:</span>
            <input
              type="number"
              min="0"
              max="23"
              [(ngModel)]="targetHours"
              (ngModelChange)="onTargetChange()"
              class="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-bold text-white"
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              [(ngModel)]="targetMinutes"
              (ngModelChange)="onTargetChange()"
              class="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-bold text-white"
            />
            <span class="text-slate-500 font-mono">(HH : MM)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-medium">Status:</span>
            <span
              class="text-sm font-mono font-bold"
              [ngClass]="
                state.isPresented() && state.activeContent().timerMode === 'countdown'
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              "
            >
              {{ countdownDisplay() }}
            </span>
            @if (!(state.isPresented() && state.activeContent().timerMode === 'countdown')) {
              <span class="text-[11px] text-slate-500 italic">
                (Click "Present Timer" to start countdown)
              </span>
            }
          </div>
        </div>
      }

      <!-- POMODORO DURATION CONTENT -->
      @if (activeSubtab() === 'pomodoro') {
        <div class="flex flex-col gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs text-slate-300">
              <span>Duration:</span>
              <input
                type="number"
                min="0"
                max="99"
                [(ngModel)]="pomodoroMinutes"
                class="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-bold text-white"
              />
              <span>:</span>
              <input
                type="number"
                min="0"
                max="59"
                [(ngModel)]="pomodoroSeconds"
                class="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-bold text-white"
              />
              <span class="text-slate-500 font-mono">(MM : SS)</span>
            </div>
            <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="countUp"
                class="rounded bg-slate-800 border-slate-700 text-sky-600"
              />
              <span>Count up</span>
            </label>
          </div>
          <div class="text-3xl font-mono font-bold text-amber-400 py-2">
            {{ pomodoroDisplay() }}
          </div>
        </div>
      }

      <!-- PRESENT BUTTON -->
      <div class="flex justify-end">
        <button
          (click)="presentTimer()"
          class="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-colors shadow-lg"
        >
          Present Timer
        </button>
      </div>
    </div>
  `,
})
export class TimerPanelComponent implements OnInit, OnDestroy {
  state = inject(PresentationStateService);

  activeSubtab = signal<'time-now' | 'countdown' | 'pomodoro'>('time-now');

  // Clock state
  clockFormat = '12';
  currentTimeString = signal<string>('');

  // Countdown state
  targetHours = 12;
  targetMinutes = 0;
  countdownDisplay = signal<string>('12:00 (Target)');

  // Pomodoro state
  pomodoroMinutes = 5;
  pomodoroSeconds = 0;
  countUp = false;
  pomodoroCurrent = 0;
  pomodoroDisplay = signal<string>('05:00');

  private intervalId: any = null;

  ngOnInit() {
    this.updateClock();
    this.intervalId = setInterval(() => {
      this.updateClock();
      if (this.state.isPresented() && this.state.activeContent().timerMode === 'countdown') {
        this.updateCountdown();
      }
    }, 250);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  selectSubtab(tab: 'time-now' | 'countdown' | 'pomodoro') {
    this.activeSubtab.set(tab);
    if (tab === 'countdown') {
      this.onTargetChange();
    } else if (tab === 'pomodoro') {
      this.pomodoroCurrent = this.pomodoroMinutes * 60 + this.pomodoroSeconds;
      this.formatPomodoro();
    }
  }

  onTargetChange() {
    if (!(this.state.isPresented() && this.state.activeContent().timerMode === 'countdown')) {
      const hStr = String(this.targetHours).padStart(2, '0');
      const mStr = String(this.targetMinutes).padStart(2, '0');
      this.countdownDisplay.set(`Target ${hStr}:${mStr}`);
    }
  }

  private updateClock() {
    const now = new Date();
    if (this.clockFormat === '24') {
      this.currentTimeString.set(now.toTimeString().split(' ')[0]);
    } else {
      this.currentTimeString.set(now.toLocaleTimeString());
    }

    if (this.state.isPresented() && this.state.activeContent().timerMode === 'time-now') {
      this.state.activeContent.update((c) => ({
        ...c,
        timerClockFormat: this.clockFormat as '12' | '24',
        timerTarget: this.currentTimeString(),
        text: this.currentTimeString(),
      }));
    }
  }

  private updateCountdown() {
    const active = this.state.activeContent();
    const targetTimestamp = active.timerTargetTimestamp;

    if (!this.state.isPresented() || !targetTimestamp) {
      this.onTargetChange();
      return;
    }

    const now = new Date();
    const diff = targetTimestamp - now.getTime();
    if (diff <= 0) {
      this.countdownDisplay.set('0');
      this.state.hide();
    } else {
      const totalSeconds = Math.floor(diff / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      let str = '';
      if (h > 0) {
        str = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      } else if (m > 0) {
        str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      } else {
        str = `${String(s).padStart(2, '0')}`;
      }
      this.countdownDisplay.set(str);
    }
  }

  private formatPomodoro() {
    const m = Math.floor(this.pomodoroCurrent / 60);
    const s = this.pomodoroCurrent % 60;
    this.pomodoroDisplay.set(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
  }

  presentTimer() {
    const sub = this.activeSubtab();
    const now = new Date();
    let display = '';
    let targetTimestamp: number | undefined = undefined;
    let durationSeconds: number | undefined = undefined;
    let startTimestamp: number | undefined = undefined;

    if (sub === 'time-now') {
      display = this.currentTimeString();
    } else if (sub === 'countdown') {
      let target = new Date();
      target.setHours(this.targetHours, this.targetMinutes, 0, 0);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      targetTimestamp = target.getTime();
      this.updateCountdown();
      display = this.countdownDisplay();
    } else {
      durationSeconds = this.pomodoroMinutes * 60 + this.pomodoroSeconds;
      startTimestamp = now.getTime();
      display = `${String(this.pomodoroMinutes).padStart(2, '0')}:${String(this.pomodoroSeconds).padStart(2, '0')}`;
    }

    this.state.present({
      type: 'TIMER',
      timerMode: sub,
      timerClockFormat: this.clockFormat as '12' | '24',
      timerTarget: display,
      timerTargetTimestamp: targetTimestamp,
      timerDurationSeconds: durationSeconds,
      timerStartTimestamp: startTimestamp,
      timerCountUp: this.countUp,
      text: display,
    });
  }
}
