import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Settings from '../components/Settings';

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        currentUser: {
            uid: 'test-user-id',
            email: 'test@example.com',
            displayName: 'Test Runner',
            photoURL: null
        },
        logout: vi.fn().mockResolvedValue()
    })
}));

const renderSettings = () => {
    return render(
        <BrowserRouter>
            <Settings />
        </BrowserRouter>
    );
};

describe('Settings Component', () => {
    it('renders the settings page header', () => {
        renderSettings();
        expect(screen.getByText('SYSTEM SETTINGS')).toBeInTheDocument();
    });

    it('displays user account information', () => {
        renderSettings();
        expect(screen.getByText('Test Runner')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('shows account info section', () => {
        renderSettings();
        expect(screen.getByText('ACCOUNT INFO')).toBeInTheDocument();
    });

    it('shows security section with logout button', () => {
        renderSettings();
        expect(screen.getByText('SECURITY')).toBeInTheDocument();
        expect(screen.getByText('LOGOUT')).toBeInTheDocument();
    });

    it('shows danger zone with delete account button', () => {
        renderSettings();
        expect(screen.getByText('DANGER ZONE')).toBeInTheDocument();
        expect(screen.getByText('DELETE ACCOUNT')).toBeInTheDocument();
    });

    it('shows delete confirmation when delete button clicked', () => {
        renderSettings();
        fireEvent.click(screen.getByText('DELETE ACCOUNT'));
        expect(screen.getByText(/CONFIRM DELETION/)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Type DELETE to confirm')).toBeInTheDocument();
    });

    it('disables confirm delete button until DELETE is typed', () => {
        renderSettings();
        fireEvent.click(screen.getByText('DELETE ACCOUNT'));
        const confirmButton = screen.getByText('CONFIRM DELETE');
        expect(confirmButton).toBeDisabled();

        const input = screen.getByPlaceholderText('Type DELETE to confirm');
        fireEvent.change(input, { target: { value: 'DELETE' } });
        expect(confirmButton).not.toBeDisabled();
    });

    it('closes delete confirmation when cancel clicked', () => {
        renderSettings();
        fireEvent.click(screen.getByText('DELETE ACCOUNT'));
        expect(screen.getByText(/CONFIRM DELETION/)).toBeInTheDocument();

        fireEvent.click(screen.getByText('CANCEL'));
        expect(screen.queryByText(/CONFIRM DELETION/)).not.toBeInTheDocument();
    });
});
