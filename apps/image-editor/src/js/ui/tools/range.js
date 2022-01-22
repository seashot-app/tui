import snippet from 'tui-code-snippet';

/**
 * Range control class
 * @class
 * @ignore
 */
class Range {
  /**
   * @constructor
   * @extends {View}
   * @param {Object} rangeElements - Html resources for creating sliders
   *  @param {HTMLElement} rangeElements.slider - b
   *  @param {HTMLElement} [rangeElements.input] - c
   * @param {Object} options - Slider make options
   *  @param {number} options.min - min value
   *  @param {number} options.max - max value
   *  @param {number} options.value - default value
   *  @param {number} [options.useDecimal] - Decimal point processing.
   *  @param {boolean} [options.realTimeEvent] - Reflect live events.
   *  @param {boolean} [options.disabled] - Disabled.
   */
  constructor(rangeElements, options = {}) {
    this.rangeElement = rangeElements.slider;
    this.rangeInputElement = rangeElements.input;
    this.rangeElement.classList.add('tui-image-editor-range');

    this.range = document.createElement('input');
    this.range.type = 'range';
    this.range.className = 'tui-image-editor-range-bar';

    this['default'] = options.value;
    this.range.value = options.value;
    this.range.min = options.min;
    this.range.max = options.max;
    this.range.step = options.useDecimal ? 'any' : 1;
    this.range.disabled = !!options.disabled;
    this.range.style.setProperty(
      '--ratio',
      `${((this.range.value - this.range.min) / (this.range.max - this.range.min)) * 100}%`
    );
    this.range.oninput = () => this._rangeUpdate.bind(this)(false);
    this.range.onchange = () => this._rangeUpdate.bind(this)(true);

    if (this.rangeInputElement) {
      this.rangeInputElement.oninput = () => this._inputUpdate(false);
      this.rangeInputElement.onchange = () => this._inputUpdate(true);

      this.rangeInputElement.disabled = !!options.disabled;
      this.rangeInputElement.type = 'number';
      this.rangeInputElement.min = options.min;
      this.rangeInputElement.max = options.max;
      this.rangeInputElement.step = options.useDecimal ? (options.max - options.min) / 100 : 1;
      this.rangeInputElement.value = options.value;
    }
    this.realTimeEvent = options.realTimeEvent;
    this.rangeElement.appendChild(this.range);
    this.trigger('change');
  }

  _rangeUpdate(last) {
    this.range.style.setProperty(
      '--ratio',
      `${((this.range.value - this.range.min) / (this.range.max - this.range.min)) * 100}%`
    );
    if (this.rangeInputElement) {
      this.rangeInputElement.value = this.range.value;
    }

    if (this.realTimeEvent || last) {
      this.fire('change', this.range.value, last);
    }
  }

  _inputUpdate(last) {
    this.range.style.setProperty(
      '--ratio',
      `${((this.range.value - this.range.min) / (this.range.max - this.range.min)) * 100}%`
    );
    this.range.value = this.rangeInputElement.value;
    if (this.realTimeEvent || last) {
      this.fire('change', this.range.value, last);
    }
  }

  /**
   * Destroys the instance.
   */
  destroy() {
    this.rangeElement.innerHTML = '';
    snippet.forEach(this, (value, key) => {
      this[key] = null;
    });
  }

  /**
   * Get max value
   * @returns {Number} max value
   */

  get max() {
    return Number(this.range.max);
  }

  /**
   * Set range max value and re position cursor
   * @param {number} maxValue - max value
   */
  set max(maxValue) {
    this.range.max = maxValue;
    if (this.rangeInputElement) {
      this.rangeInputElement.max = maxValue;
    }
    this.range.style.setProperty(
      '--ratio',
      `${((this.range.value - this.range.min) / (this.range.max - this.range.min)) * 100}%`
    );
  }

  /**
   * Get min value
   * @returns {Number} min value
   */
  get min() {
    return Number(this.range.min);
  }

  /**
   * Set range min value and re position cursor
   * @param {number} minValue - min value
   */
  set min(minValue) {
    this.range.min = minValue;
    if (this.rangeInputElement) {
      this.rangeInputElement.min = minValue;
    }
    this.range.style.setProperty(
      '--ratio',
      `${((this.range.value - this.range.min) / (this.range.max - this.range.min)) * 100}%`
    );
  }

  /**
   * Get range value
   * @returns {Number} range value
   */
  get value() {
    return Number(this.range.value);
  }

  /**
   * Set range value
   * @param {Number} value range value
   */
  set value(value) {
    this.range.value = value;
    if (this.rangeInputElement) {
      this.rangeInputElement.value = value;
    }
    this.range.style.setProperty(
      '--ratio',
      `${((this.range.value - this.range.min) / (this.range.max - this.range.min)) * 100}%`
    );
  }

  /**
   * Get disabled value
   * @returns {Number} disabled value
   */
  get disabled() {
    return this.range.disabled;
  }

  /**
   * Set range value
   * @param {Number} value disabled value
   */
  set disabled(value) {
    this.range.disabled = value;
    if (this.rangeInputElement) {
      this.rangeInputElement.disabled = value;
    }
  }

  /**
   * event trigger
   * @param {string} type - type
   */
  trigger(type) {
    this.fire(type, this.range.value);
  }
}

snippet.CustomEvents.mixin(Range);

export default Range;
