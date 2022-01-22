import Component from '@/interface/component';
import { componentNames } from '@/consts';

/**
 * Resize components
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @class Resize
 * @ignore
 */
class Resize extends Component {
  constructor(graphics) {
    super(componentNames.RESIZE, graphics);

    /**
     * Current dimensions
     * @type {Object}
     * @private
     */
    this._dimensions = null;

    /**
     * Original dimensions
     * @type {Object}
     * @private
     */
    this._originalDimensions = null;

    /**
     * Original positions
     * @type {Array}
     * @private
     */
    this._originalPositions = null;
  }

  /**
   * Get current dimensions
   * @returns {object}
   */
  getCurrentPositions() {
    this._positions = this.getCanvas()
      .getObjects()
      .map(({ left, top, scaleX, scaleY }) => {
        return { left, top, scaleX, scaleY };
      });

    return this._positions;
  }

  /**
   * Get original dimensions
   * @returns {object}
   */
  getOriginalPositions() {
    return this._originalPositions;
  }

  /**
   * Set original positions
   * @param {object} positions - Positions
   */
  setOriginalPositions(positions) {
    this._originalPositions = positions;
  }

  /**
   * Get current dimensions
   * @returns {object}
   */
  getCurrentDimensions() {
    const canvasImage = this.getCanvasImage();
    if (!this._dimensions && canvasImage) {
      const { width, height } = canvasImage;
      this._dimensions = { width, height };
    }

    return this._dimensions;
  }

  /**
   * Get original dimensions
   * @returns {object}
   */
  getOriginalDimensions() {
    return this._originalDimensions;
  }

  /**
   * Set original dimensions
   * @param {object} dimensions - Dimensions
   */
  setOriginalDimensions(dimensions) {
    this._originalDimensions = dimensions;
  }

  /**
   * Resize Image
   * @param {Object} dimensions - Resize dimensions
   * @returns {Promise}
   */
  resize(dimensions) {
    const canvas = this.getCanvas();
    const canvasImage = this.getCanvasImage();
    const { width, height } = dimensions;
    const { width: originalWidth, height: originalHeight } = this.getOriginalDimensions();
    const scaleX = width / originalWidth;
    const scaleY = height / originalHeight;
    if (width !== canvas.width || height !== canvas.height) {
      const { width: startWidth, height: startHeight } = canvasImage.getOriginalSize();
      canvasImage.scaleX = width / startWidth;
      canvasImage.scaleY = height / startHeight;
      this._dimensions = dimensions;

      if (this._originalPositions) {
        canvas.getObjects().forEach((obj, i) => {
          const pos = this._originalPositions[i];
          obj.scaleX = pos.scaleX * scaleX;
          obj.scaleY = pos.scaleY * scaleY;
          obj.left = pos.left * scaleX;
          obj.top = pos.top * scaleY;
          obj.setCoords();
        });
      }
      canvas.setWidth(width);
      canvas.setHeight(height);
    }

    return Promise.resolve();
  }

  /**
   * Start resizing
   */
  start() {
    this.setOriginalDimensions(this.getCurrentDimensions());
    this.setOriginalPositions(this.getCurrentPositions());
  }

  /**
   * End resizing
   */
  end() {}
}

export default Resize;
