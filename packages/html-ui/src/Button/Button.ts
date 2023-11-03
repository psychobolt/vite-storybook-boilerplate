import { html } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import classes from "./Button.module.scss";

export interface ButtonProps {
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
  size?: "small" | "medium" | "large";
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
  size = "medium",
  label,
  onClick,
}: ButtonProps) => {
  const mode = primary
    ? classes.storybookButtonPrimary
    : classes.storybookButtonSecondary;

  return html`
    <button
      type="button"
      class=${[
        classes.storybookButton,
        classes[`storybook-button--${size}`],
        mode,
      ].join(" ")}
      style=${styleMap({ backgroundColor })}
      @click=${onClick}
    >
      ${label}
    </button>
  `;
};
