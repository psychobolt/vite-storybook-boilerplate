import type { ComponentProps } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './Button.module.scss';

const sizes = ['small', 'medium', 'large'] as const;

export interface Props extends ComponentProps<'button'> {
  /**
   * Please use `className` property
   *
   * @deprecated
   */
  primary?: boolean;
  /**
   * How large should the button be?
   */
  size?: (typeof sizes)[number];
}

/**
 * Primary UI component for user interaction
 */
export function Button({
  primary,
  className = styles.storybookButtonPrimary,
  size = 'medium',
  ...props
}: Props) {
  return (
    <button
      {...props}
      type='button'
      className={classNames(
        styles.storybookButton,
        styles[`storybook-button--${size}`],
        typeof primary === 'boolean' &&
          primary &&
          styles.storybookButtonPrimary,
        className
      )}
    />
  );
}

Button.propTypes = {
  primary: PropTypes.bool,
  size: PropTypes.oneOf(sizes)
};
