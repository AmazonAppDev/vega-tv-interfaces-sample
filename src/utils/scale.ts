/**
 * DIP (density-independent pixel) conversion for the RN 0.72 -> RN 0.83 migration.
 *
 * React Native 0.83 on Vega uses density-independent pixels (dp) for all layout
 * values. The canvas reference size is 960x540 dp, i.e. a fixed scale factor of
 * 2 on 1080p displays; the framework automatically scales dp values to physical
 * pixels.
 *
 * This app's values were originally authored in RN 0.72 physical pixels
 * (1920x1080 canvas). The 1080p Vega display has a fixed pixel density of 2
 * physical pixels per dp, so each physical-pixel value is multiplied by a scale
 * factor of 0.5 (a factor between 0 and 1 shrinks the value) to express it in
 * dp. This applies to all layout values including font sizes.
 *
 *   width: scale(1920)   // -> 960 dp
 *   padding: scale(32)   // -> 16 dp
 *   fontSize: scale(48)  // -> 24 dp
 *
 * Note: the scale factor is FIXED (not derived from Dimensions at runtime),
 * matching the migration guide's guidance for 1080p Vega devices.
 */

// Fixed scale factor for 1080p Vega displays (960x540 dp canvas): the inverse
// of the display's 2x pixel density. A factor < 1 shrinks physical px to dp.
export const SCALE_FACTOR = 0.5;

/**
 * Convert an RN 0.72 physical-pixel value to an RN 0.83 dp value by multiplying
 * by the scale factor. Use for all hardcoded pixel values: widths, heights,
 * spacing, radii, borders, and font sizes.
 *
 * The result is intentionally NOT rounded: React Native supports fractional dp,
 * and on the 2x panel a value like 0.5 dp maps to exactly 1 physical pixel. This
 * preserves exact ratios (e.g. a 1px border stays 1px instead of doubling, and
 * odd values like 3/5 don't drift upward).
 */
export const scale = (size: number): number => size * SCALE_FACTOR;
