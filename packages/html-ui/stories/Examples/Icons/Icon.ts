import { html } from 'lit';

export interface Props {
  icon: string;
}

export const Icon = ({ icon }: Props) => html`<i class=${icon}></i>`;
