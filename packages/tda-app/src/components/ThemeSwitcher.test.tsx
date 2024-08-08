import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ThemeSwitcher from './ThemeSwitcher';
import useConfig from '@/hooks/useConfig';
import { ThemeMode } from '@/config';

jest.mock('../hooks/useConfig');

describe('ThemeSwitcher', () => {
  let mode: ThemeMode;
  let setMode: jest.Mock;
  let onChangeMode: jest.Mock;

  beforeEach(() => {
    mode = ThemeMode.LIGHT;
    setMode = jest.fn(newMode => {
      mode = newMode;
      mockUseConfig.mockReturnValue({
        mode,
        onChangeMode,
      });
    });

    onChangeMode = jest.fn((newMode: ThemeMode) => {
      setMode(newMode);
    });

    const mockUseConfig = useConfig as jest.Mock;
    mockUseConfig.mockReturnValue({
      mode,
      onChangeMode,
    });
  });

  it('should render the switch', () => {
    render(<ThemeSwitcher />);
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toBeInTheDocument();
  });

  it('should call onChangeMode', () => {
    render(<ThemeSwitcher />);
    const switchElement = screen.getByRole('checkbox');

    // Initial state should be unchecked (light mode)
    expect(switchElement).not.toBeChecked();

    // Click to switch to dark mode
    fireEvent.click(switchElement);
    expect(onChangeMode).toHaveBeenCalledWith(ThemeMode.DARK);
  });
});
