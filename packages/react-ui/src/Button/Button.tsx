import classNames from 'classnames';
import PropTypes from 'prop-types';

const sizes = ['small', 'medium', 'large'] as const;

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
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: Props) {
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary';
  return (
    <button
      type='button'
      className={classNames(
        'storybook-button',
        `storybook-button--${size}`,
        mode
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
