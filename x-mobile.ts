// Virtual Controls Injection Script for Lovable/Web Apps
(function () {
  // Guard to prevent double injection
  if (document.getElementById('lovable-mobile-controls')) return;

  // --- CONFIGURATION ---
  const ACTION_KEYS = ['E', 'Q', 'Space', 'Shift']; 
  const JOYSTICK_SIZE = 120;
  const KNOB_SIZE = 50;

  // --- STYLES INJECTION ---
  const styles = `
    #lovable-mobile-controls {
      position: fixed;
      bottom: 20px;
      left: 0;
      right: 0;
      height: 160px;
      z-index: 999999;
      pointer-events: none;
      font-family: system-ui, -apple-system, sans-serif;
      user-select: none;
      -webkit-user-select: none;
    }
    .mobile-joystick {
      position: absolute;
      bottom: 10px;
      width: ${JOYSTICK_SIZE}px;
      height: ${JOYSTICK_SIZE}px;
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      pointer-events: auto;
      touch-action: none;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    #wasd-joystick { left: 30px; }
    #mouse-joystick { right: 30px; }
    .joystick-knob {
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${KNOB_SIZE}px;
      height: ${KNOB_SIZE}px;
      margin-top: -${KNOB_SIZE / 2}px;
      margin-left: -${KNOB_SIZE / 2}px;
      background: rgba(255, 255, 255, 0.75);
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      transition: transform 0.05s linear;
    }
    .mobile-buttons-panel {
      position: absolute;
      bottom: 150px;
      right: 30px;
      display: flex;
      gap: 12px;
      pointer-events: auto;
    }
    .mobile-btn {
      width: 55px;
      height: 55px;
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      font-weight: bold;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      touch-action: none;
      cursor: pointer;
    }
    .mobile-btn:active {
      background: rgba(255, 255, 255, 0.9);
      color: #000;
      transform: scale(0.95);
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // --- UI CREATION ---
  const container = document.createElement('div');
  container.id = 'lovable-mobile-controls';

  // WASD Joystick UI
  const wasdJoy = document.createElement('div');
  wasdJoy.className = 'mobile-joystick';
  wasdJoy.id = 'wasd-joystick';
  const wasdKnob = document.createElement('div');
  wasdKnob.className = 'joystick-knob';
  wasdJoy.appendChild(wasdKnob);
  container.appendChild(wasdJoy);

  // Mouse Joystick UI
  const mouseJoy = document.createElement('div');
  mouseJoy.className = 'mobile-joystick';
  mouseJoy.id = 'mouse-joystick';
  const mouseKnob = document.createElement('div');
  mouseKnob.className = 'joystick-knob';
  mouseJoy.appendChild(mouseKnob);
  container.appendChild(mouseJoy);

  // Action Buttons UI
  const buttonsPanel = document.createElement('div');
  buttonsPanel.className = 'mobile-buttons-panel';
  
  ACTION_KEYS.forEach(key => {
    const btn = document.createElement('div');
    btn.className = 'mobile-btn';
    btn.innerText = key === 'Space' ? '⌴' : key;
    
    const domKey = key === 'Space' ? ' ' : key;

    // Support both Touch events (mobile) and Mouse events (Lovable Desktop preview)
    const startHandler = (e: Event) => {
      e.preventDefault();
      triggerKeyEvent('keydown', domKey);
    };
    const endHandler = (e: Event) => {
      e.preventDefault();
      triggerKeyEvent('keyup', domKey);
    };

    btn.addEventListener('touchstart', startHandler, { passive: false });
    btn.addEventListener('touchend', endHandler, { passive: false });
    btn.addEventListener('mousedown', startHandler);
    btn.addEventListener('mouseup', endHandler);
    
    buttonsPanel.appendChild(btn);
  });
  
  container.appendChild(buttonsPanel);
  document.body.appendChild(container);

  // --- KEY EVENT EMITTER ---
  function triggerKeyEvent(type: 'keydown' | 'keyup', key: string) {
    let code = key;
    if (key === ' ') code = 'Space';
    else if (key.length === 1) code = `Key${key.toUpperCase()}`;

    // Target active input element if focused, fallback to window
    const target = document.activeElement || window;

    const event = new KeyboardEvent(type, {
      key: key,
      code: code,
      bubbles: true,
      cancelable: true,
      composed: true // Allows event to pass through Shadow DOM boundaries
    });
    
    target.dispatchEvent(event);
  }

  // --- UNIVERSAL CONTROLLER CLASS (TOUCH & MOUSE PREVIEW) ---
  class Joystick {
    private el: HTMLElement;
    private knob: HTMLElement;
    private centerX = 0;
    private centerY = 0;
    private maxRadius = JOYSTICK_SIZE / 2;
    private isDragging = false;
    private onUpdate: (x: number, y: number) => void;
    private onEnd: () => void;

    constructor(el: HTMLElement, onUpdate: (x: number, y: number) => void, onEnd: () => void) {
      this.el = el;
      this.knob = el.querySelector('.joystick-knob') as HTMLElement;
      this.onUpdate = onUpdate;
      this.onEnd = onEnd;

      // Touch Bindings
      this.el.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
      window.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
      window.addEventListener('touchend', this.handleEnd.bind(this));

      // Mouse Bindings (for Lovable Desktop testing environment)
      this.el.addEventListener('mousedown', this.handleStart.bind(this));
      window.addEventListener('mousemove', this.handleMove.bind(this));
      window.addEventListener('mouseup', this.handleEnd.bind(this));
    }

    private getCoordinates(e: TouchEvent | MouseEvent): { x: number; y: number } | null {
      if ('touches' in e) {
        if (e.touches.length === 0) return null;
        // Target touch relative to this specific joystick's proximity
        const rect = this.el.getBoundingClientRect();
        for (let i = 0; i < e.touches.length; i++) {
          const t = e.touches[i];
          const dist = Math.hypot(t.clientX - (rect.left + rect.width/2), t.clientY - (rect.top + rect.height/2));
          if (dist < JOYSTICK_SIZE * 1.5 || this.isDragging) {
            return { x: t.clientX, y: t.clientY };
          }
        }
        return null;
      }
      return { x: e.clientX, y: e.clientY };
    }

    private handleStart(e: TouchEvent | MouseEvent) {
      const coords = this.getCoordinates(e);
      if (!coords) return;
      e.preventDefault();

      this.isDragging = true;
      const rect = this.el.getBoundingClientRect();
      this.centerX = rect.left + rect.width / 2;
      this.centerY = rect.top + rect.height / 2;

      this.processMove(coords.x, coords.y);
    }

    private handleMove(e: TouchEvent | MouseEvent) {
      if (!this.isDragging) return;
      const coords = this.getCoordinates(e);
      if (!coords) return;
      e.preventDefault();

      this.processMove(coords.x, coords.y);
    }

    private handleEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.knob.style.transform = `translate(0px, 0px)`;
      this.onEnd();
    }

    private processMove(clientX: number, clientY: number) {
      let deltaX = clientX - this.centerX;
      let deltaY = clientY - this.centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > this.maxRadius) {
        deltaX = (deltaX / distance) * this.maxRadius;
        deltaY = (deltaY / distance) * this.maxRadius;
      }

      this.knob.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      const normX = deltaX / this.maxRadius;
      const normY = deltaY / this.maxRadius;
      this.onUpdate(normX, normY);
    }
  }

  // --- WASD MAPPING ---
  let activeWASD = { w: false, a: false, s: false, d: false };
  
  new Joystick(wasdJoy, 
    (x, y) => {
      const threshold = 0.35;
      const targetStates = {
        w: y < -threshold,
        s: y > threshold,
        a: x < -threshold,
        d: x > threshold
      };

      (Object.keys(targetStates) as Array<keyof typeof targetStates>).forEach(key => {
        if (targetStates[key] !== activeWASD[key]) {
          activeWASD[key] = targetStates[key];
          triggerKeyEvent(activeWASD[key] ? 'keydown' : 'keyup', key);
        }
      });
    },
    () => {
      Object.keys(activeWASD).forEach(key => {
        if (activeWASD[key as keyof typeof activeWASD]) {
          activeWASD[key as keyof typeof activeWASD] = false;
          triggerKeyEvent('keyup', key);
        }
      });
    }
  );

  // --- MOUSE MOVEMENT SIMULATION ---
  let mouseDelta = { x: 0, y: 0 };
  let mouseInterval: number | null = null;
  const SENSITIVITY = 18; 

  new Joystick(mouseJoy,
    (x, y) => {
      mouseDelta.x = x * SENSITIVITY;
      mouseDelta.y = y * SENSITIVITY;

      if (!mouseInterval) {
        mouseInterval = window.setInterval(() => {
          const moveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            composed: true,
            clientX: window.innerWidth / 2, 
            clientY: window.innerHeight / 2,
            movementX: mouseDelta.x,
            movementY: mouseDelta.y
          });
          window.dispatchEvent(moveEvent);
        }, 16); 
      }
    },
    () => {
      if (mouseInterval) {
        clearInterval(mouseInterval);
        mouseInterval = null;
      }
      mouseDelta = { x: 0, y: 0 };
    }
  );

})();
