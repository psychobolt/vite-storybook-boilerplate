import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Button.module.scss';

const sizes = ['small', 'medium', 'large'] as const;

interface Props {
  /**
   * Is this the principal call to action on the page?
   */
  variant?: string;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: (typeof sizes)[number];
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
  variant = styles.storybookButtonPrimary,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: Props) {
  return (
    <button
      type='button'
      className={classNames(
        styles.storybookButton,
        styles[`storybook-button--${size}`],
        variant
      )}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(sizes),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
