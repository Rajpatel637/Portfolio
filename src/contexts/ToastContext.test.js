import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';
import Toast from '../components/Toast/Toast';

// Test component that uses the toast context
function TestComponent() {
  const { success, error, warning, info } = useToast();

  return (
    <div>
      <button onClick={() => success('Success message')}>Show Success</button>
      <button onClick={() => error('Error message')}>Show Error</button>
      <button onClick={() => warning('Warning message')}>Show Warning</button>
      <button onClick={() => info('Info message')}>Show Info</button>
      <Toast />
    </div>
  );
}

describe('ToastContext', () => {
  test('provides toast functions', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByText('Show Success')).toBeInTheDocument();
    expect(screen.getByText('Show Error')).toBeInTheDocument();
    expect(screen.getByText('Show Warning')).toBeInTheDocument();
    expect(screen.getByText('Show Info')).toBeInTheDocument();
  });

  test('displays success toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    
    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  test('displays error toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Error'));
    
    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  test('can close toast manually', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Info'));
    
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close notification/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Info message')).not.toBeInTheDocument();
    });
  });

  test('throws error when used outside provider', () => {
    // Suppress console error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    spy.mockRestore();
  });
});
