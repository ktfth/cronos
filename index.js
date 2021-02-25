'use strict';

function give(p, f) {
  if (p === 'minute' && f === undefined) return give() * 60;
  if (p === 'hour' && f === undefined) return give('minute') * 60;
  if ((p === undefined || p === 'second') && f === undefined) return 1000;
}
exports.give = give;

function timeLapse(display) {
  let d = display.split(':')
  let out = 0;
  const h = () => parseInt(d[0], 10);
  const m = () => parseInt(d[1], 10);
  const s = () => parseInt(d[2], 10);
  if (h() > 0) {
    out += give('hour') * h();
  }
  if (m() > 0) {
    out += give('minute') * m();
  }
  if (s() > 0) {
    out += give('second') * s();
  }
  return out;
};
exports.timeLapse = timeLapse;

function treatTime(display) {
  display = display.split(':').map(v => parseInt(v, 10));
  display = [
    display[0] < 10 && display[0] > 0 ? '0' + display[0] : display[0],
    display[1] < 10 && display[1] > 0 ? '0' + display[1] : display[1],
    display[2] < 10 && display[2] > 0 ? '0' + display[2] : display[2],
  ].join(':');
  return display;
}
exports.treatTime = treatTime;

function Trigger(display, callback) {
  let self = this;
  let trigger = null;
  let tl = 0;

  self.display = display;

  self.releaseTheLastPhaseOfHour = false;
  self.isHourUpdate = false;
  self.releaseTheLastPhaseOfMinute = false;
  self.isMinuteUpdate = false;
  self.releaseTheLastPhaseOfSecond = false;

  function startCronosTrigger(cb) {
    let tl = timeLapse(self.getDisplay());
    self.setDisplay(treatTime(self.getDisplay()));
    trigger = setInterval(() => {
      if (tl >= 0) {
        self.setDisplay(
          display
            .split(':')
            .map((v, i) => {
              if (i === 2) {
                let t = parseInt(v, 10);
                if (t > 0) {
                  t -= 1;
                  if (!self.releaseTheLastPhaseOfSecond && t === 0) {
                    self.releaseTheLastPhaseOfSecond = true;
                  }
                }
                if (t === 0) {
                  self.releaseTheLastPhaseOfSecond = true;
                  t = '00';
                }
                v = t < 10 && t > 0 ? '0' + t : t;
              }
              if (i === 1) {
                let t = parseInt(v, 10);
                if (t > 0 && display[2] === '00') {
                  if (self.releaseTheLastPhaseOfSecond) {
                    t -= 1;
                    self.releaseTheLastPhaseOfSecond = false;
                    isMinuteUpdate = true;
                  }
                  if (!self.releaseTheLastPhaseOfMinute && t === 0) {
                    self.releaseTheLastPhaseOfMinute = true;
                  }
                }
                if (t === 0) {
                  t = '00';
                }
                v = t < 10 && t > 0 ? '0' + t : t;
              }
              if (i === 0) {
                let t = parseInt(v, 10);
                if (t > 0 && display[1] === '00') {
                  if (!self.releaseTheLastPhaseOfHour) {
                    t -= 1;
                    self.releaseTheLastPhaseOfHour = true;
                    self.isHourUpdate = true;
                  }
                  if (self.releaseTheLastPhaseOfMinute) {
                    t -= 1;
                    self.releaseTheLastPhaseOfMinute = false;
                    self.isHourUpdate = true;
                  }
                  if (!self.releaseTheLastPhaseOfHour && t === 0) {
                    self.releaseTheLastPhaseOfHour = true;
                  }
                }
                if (t === 0) {
                  t = '0';
                }
                v = t;
              }
              return v;
            })
            .join(':')
        );

        self.updateHour();

        self.checkHourUpdate();

        self.updateMinute();

        self.checkMinuteUpdate();
      } if (global !== undefined) {
        global.display = display;
      } else {
        clearInterval(trigger);
      }
      tl -= 1000;
    }, 1000);

    cb && cb();
  }
  startCronosTrigger(callback);
}

function triggerGetDisplay() {
  return this.display;
}
Trigger.prototype.getDisplay = triggerGetDisplay;

function triggerSetDisplay(v) {
  this.display = v;
  return this;
}
Trigger.prototype.setDisplay = triggerSetDisplay;

function triggerUpdateHour() {
  let self = this;
  if (self.releaseTheLastPhaseOfHour) {
    let d = self.getDisplay().split(':');
    d[1] = '59';
    d[2] = '59';
    self.setDisplay(d.join(':'));
    self.releaseTheLastPhaseOfHour = false;
  }
  return self;
}
Trigger.prototype.updateHour = triggerUpdateHour;

function triggerCheckHourUpdate() {
  let self = this;
  if (self.isHourUpdate) {
    let d = self.getDisplay().split(':');
    let hours = parseInt(d[0], 10);
    if (hours > 0) {
      d[1] = '59';
      self.setDisplay(d.join(':'));
      self.isHourUpdate = false;
    }
  }
  return self;
}
Trigger.prototype.checkHourUpdate = triggerCheckHourUpdate;

function triggerUpdateMinute() {
  let self = this;
  if (self.releaseTheLastPhaseOfMinute) {
    let d = self.getDisplay().split(':');
    d[2] = '59';
    self.setDisplay(d.join(':'));
    self.releaseTheLastPhaseOfMinute = false;
  }
  return self;
}
Trigger.prototype.updateMinute = triggerUpdateMinute;

function triggerCheckMinuteUpdate() {
  let self = this;
  if (self.isMinuteUpdate) {
    let d = self.getDisplay().split(':');
    let minutes = parseInt(d[1], 10);
    if (minutes > 0) {
      d[2] = '59';
      self.setDisplay(d.join(':'));
      self.isMinuteUpdate = false;
    }
  }
  return self;
}
Trigger.prototype.checkMinuteUpdate = triggerCheckMinuteUpdate;

exports.Trigger = Trigger;
