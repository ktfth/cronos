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

function Trigger(display, callback, opts={'enableTheLastPhaseRecord': false}) {
  let self = this;
  let tl = 0;

  self.display = display;

  self.enableTheLastPhaseRecord = opts.enableTheLastPhaseRecord;

  self.releaseTheLastPhaseOfHour = false;
  self.isHourUpdate = false;
  self.releaseTheLastPhaseOfMinute = false;
  self.isMinuteUpdate = false;
  self.releaseTheLastPhaseOfSecond = false;
  self.isSecondUpdate = false;

  self.trigger = null;

  function startCronosTrigger(cb) {
    let tl = timeLapse(self.getDisplay());
    self.setDisplay(treatTime(self.getDisplay()));
    self.trigger = setInterval(() => {
      if (tl > 0) {
        self.setDisplay(
          self.getDisplay()
            .split(':')
            .map((v, i) => {
              if (i === 2) {
                v = self.displaySecond(v, i);
              }
              if (i === 1) {
                v = self.displayMinute(v, i);
              }
              if (i === 0) {
                v = self.displayHour(v, i);
              }
              return v;
            })
            .join(':')
        );

        self.updateHour();

        self.checkHourUpdate();

        self.updateMinute();

        self.checkMinuteUpdate();

        self.updateSecond();

        self.checkSecondUpdate();
      }
      tl -= 1000;
      if (self.trigger !== null && tl === 0) {
        self.stop();
      }
      cb && cb();
    }, 1000);
  }

  startCronosTrigger(callback);
}

function triggerStop() {
  clearInterval(this.trigger);
  return this;
}
Trigger.prototype.stop = triggerStop;

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

function triggerUpdateSecond() {
  let self = this;
  if (self.releaseTheLastPhaseOfSecond) {
    let d = self.getDisplay().split(':');
    // d[2] = '59';
    self.setDisplay(d.join(':'));
    self.releaseTheLastPhaseOfSecond = false;
  }
  return self;
}
Trigger.prototype.updateSecond = triggerUpdateSecond;

function triggerCheckSecondUpdate() {
  let self = this;
  if (self.isSecondUpdate) {
    let d = self.getDisplay().split(':');
    let seconds = parseInt(d[2], 10);
    if (seconds > 0) {
      self.setDisplay(d.join(':'));
      self.isSecondUpdate = false;
    }
  }
  return self;
}
Trigger.prototype.checkSecondUpdate = triggerCheckSecondUpdate;

function triggerDisplaySecond(v, i) {
  let self = this;
  let t = parseInt(v, 10);
  if (t > 0) {
    t -= 1;
    if (!self.releaseTheLastPhaseOfSecond && t === 0) {
      self.releaseTheLastPhaseOfSecond = true;
    }
    self.isSecondUpdate = true;
  }
  if (t === 0) {
    if (self.enableTheLastPhaseRecord) {
      self.releaseTheLastPhaseOfSecond = true;
    }
    t = '00';
  }
  v = t < 10 && t > 0 ? '0' + t : t;
  return v;
}
Trigger.prototype.displaySecond = triggerDisplaySecond;

function triggerDisplayMinute(v, i) {
  let self = this;
  let t = parseInt(v, 10);
  if (t > 0 && self.getDisplay().split(':')[2] === '00') {
    if (self.releaseTheLastPhaseOfSecond) {
      t -= 1;
      self.releaseTheLastPhaseOfSecond = false;
      self.isMinuteUpdate = true;
    }
    if (!self.releaseTheLastPhaseOfMinute && t === 0) {
      self.releaseTheLastPhaseOfMinute = true;
    }
  }
  if (t === 0) {
    t = '00';
  }
  v = t < 10 && t > 0 ? '0' + t : t;
  return v;
}
Trigger.prototype.displayMinute = triggerDisplayMinute;

function triggerDisplayHour(v, i) {
  let self = this;
  let t = parseInt(v, 10);
  if (t > 0 && self.getDisplay().split(':')[1] === '00') {
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
  return v;
}
Trigger.prototype.displayHour = triggerDisplayHour;

exports.Trigger = Trigger;
