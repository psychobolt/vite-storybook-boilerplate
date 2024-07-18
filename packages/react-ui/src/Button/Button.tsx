import { classNames } from 'commons/esm/.storybook/utils/functions';

import classes from './Button.module.scss';

interface Props {
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
  size?: 'small' | 'medium' | 'large';
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
export function Button({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: Props) {
  const mode = primary
    ? classes.storybookButtonPrimary
    : classes.storybookButtonSecondary;
  return (
    <button
      type='button'
      className={classNames(
        classes.storybookButton,
        classes[`storybook-button--${size}`],
        mode
      )}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
}
