import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { action } from "@storybook/addon-actions";

import Button from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const button: Meta<typeof Button> = {
  title: 'Inputs/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
  },
};

export default button;
type ButtonStory = StoryObj<typeof Button>;

export const Primary = {
  args: {
    primary: true,
    size: 'medium',
    children: 'Primary Button'
  },
};

export const Secondary = {
  args: {
    primary: false,
    size: 'medium',
    children: 'Secondary Button'
  },
};

export const Text: ButtonStory = {
  render: (args) => {
    return <Button onClick={action("clicked")} {...args}>{args.children}</Button>;
  },
  args: {
    children: 'Text Button',
    backgroundColor: 'green',
    primary: true,
    size: 'medium',
  },
};

const EmojiSpan = () => (
  <span role="img" aria-label="so cool">
    😀 😎 👍 💯
  </span>
 );

export const Emoji: ButtonStory = {
  render: (args) => {
    return <Button onClick={action("clicked")} {...args}><EmojiSpan /></Button>;
  },
  args: {
    backgroundColor: 'black',
    primary: true,
    size: 'large',
  },
};
