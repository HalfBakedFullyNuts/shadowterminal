import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IntelView from '../components/Campaigns/IntelView';

const mockCampaign = {
    clues: [
        { id: '1', item: 'Secret Document', description: 'Contains corp secrets', details: 'Found in safe', status: 'Decrypted' },
        { id: '2', item: 'Encrypted Drive', description: 'Unknown contents', details: 'Need decker', status: 'Encrypted' },
        { id: '3', item: 'Contact Info', description: 'Fixer location', details: 'Downtown bar', status: 'Decrypted' },
    ]
};

describe('IntelView Component', () => {
    it('renders the intel database header', () => {
        render(<IntelView campaign={mockCampaign} />);
        expect(screen.getByText('INTEL DATABASE')).toBeInTheDocument();
    });

    it('displays all clues in the table', () => {
        render(<IntelView campaign={mockCampaign} />);
        expect(screen.getByText('Secret Document')).toBeInTheDocument();
        expect(screen.getByText('Encrypted Drive')).toBeInTheDocument();
        expect(screen.getByText('Contact Info')).toBeInTheDocument();
    });

    it('shows search input', () => {
        render(<IntelView campaign={mockCampaign} />);
        expect(screen.getByPlaceholderText('SEARCH DATABASE...')).toBeInTheDocument();
    });

    it('filters clues by search term in item name', () => {
        render(<IntelView campaign={mockCampaign} />);
        const searchInput = screen.getByPlaceholderText('SEARCH DATABASE...');

        fireEvent.change(searchInput, { target: { value: 'secret' } });

        expect(screen.getByText('Secret Document')).toBeInTheDocument();
        expect(screen.queryByText('Encrypted Drive')).not.toBeInTheDocument();
        expect(screen.queryByText('Contact Info')).not.toBeInTheDocument();
    });

    it('filters clues by search term in description', () => {
        render(<IntelView campaign={mockCampaign} />);
        const searchInput = screen.getByPlaceholderText('SEARCH DATABASE...');

        fireEvent.change(searchInput, { target: { value: 'fixer' } });

        expect(screen.queryByText('Secret Document')).not.toBeInTheDocument();
        expect(screen.getByText('Contact Info')).toBeInTheDocument();
    });

    it('shows no results message when search has no matches', () => {
        render(<IntelView campaign={mockCampaign} />);
        const searchInput = screen.getByPlaceholderText('SEARCH DATABASE...');

        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

        expect(screen.getByText('NO MATCHING INTEL FOUND')).toBeInTheDocument();
    });

    it('clears search when X button is clicked', () => {
        render(<IntelView campaign={mockCampaign} />);
        const searchInput = screen.getByPlaceholderText('SEARCH DATABASE...');

        fireEvent.change(searchInput, { target: { value: 'secret' } });
        expect(screen.queryByText('Encrypted Drive')).not.toBeInTheDocument();

        // Click the clear button
        const clearButton = screen.getByRole('button');
        fireEvent.click(clearButton);

        // All clues should be visible again
        expect(screen.getByText('Encrypted Drive')).toBeInTheDocument();
    });

    it('shows empty state when no clues exist', () => {
        render(<IntelView campaign={{ clues: [] }} />);
        expect(screen.getByText('NO INTEL GATHERED')).toBeInTheDocument();
    });

    it('displays clue status correctly', () => {
        render(<IntelView campaign={mockCampaign} />);
        expect(screen.getAllByText('DECRYPTED').length).toBe(2);
        expect(screen.getByText('ENCRYPTED')).toBeInTheDocument();
    });
});
