import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { HTMLStoryPseudoStateProps } from 'commons/esm/.storybook/utils/story-generators';
import classNames from 'classnames';

import type { SizeEnum } from './Sizes/Primary.variants';
import classes from './Button.module.scss';

type Size = keyof typeof SizeEnum;

export interface Props extends HTMLStoryPseudoStateProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: Size;
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}
/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary,
  backgroundColor,
  size = 'medium',
  label,
  storyPseudo,
  storyAttr,
  onClick
}: Props) => {
  const mode = primary
    ? classes.storybookButtonPrimary
    : classes.storybookButtonSecondary;

  return html`
    <button
      type="button"
      class=${classNames(
        classes.storybookButton,
        classes[`storybook-button--${size}`],
        mode,
        storyPseudo
      )}
      style=${backgroundColor ? styleMap({ backgroundColor }) : nothing}
      ${storyAttr}
      @click=${onClick}
    >
      ${label}
    </button>
  `;
};
