import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CharacterSheetHeader from '../components/CharacterSheet/parts/Header';

const mockCharacter = {
    name: 'Shadow Runner',
    metatype: 'Human',
    archetype: 'Street Samurai',
    type: 'PC',
    isPublic: false,
    karma: { total: 50 },
    streetCred: 5,
    notoriety: 2
};

const defaultProps = {
    character: mockCharacter,
    setCharacter: vi.fn(),
    onSave: vi.fn(),
    isSaving: false,
    onDelete: vi.fn(),
    isNew: false
};

describe('CharacterSheetHeader Component', () => {
    it('renders character name', () => {
        render(<CharacterSheetHeader {...defaultProps} />);
        expect(screen.getByDisplayValue('Shadow Runner')).toBeInTheDocument();
    });

    it('renders metatype and archetype', () => {
        render(<CharacterSheetHeader {...defaultProps} />);
        expect(screen.getByDisplayValue('Human')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Street Samurai')).toBeInTheDocument();
    });

    it('shows save button', () => {
        render(<CharacterSheetHeader {...defaultProps} />);
        expect(screen.getByText('SAVE DATA')).toBeInTheDocument();
    });

    it('shows saving state when isSaving is true', () => {
        render(<CharacterSheetHeader {...defaultProps} isSaving={true} />);
        expect(screen.getByText('SAVING...')).toBeInTheDocument();
    });

    it('shows delete button for existing characters', () => {
        render(<CharacterSheetHeader {...defaultProps} />);
        expect(screen.getByTitle('Delete Character')).toBeInTheDocument();
    });

    it('hides delete button for new characters', () => {
        render(<CharacterSheetHeader {...defaultProps} isNew={true} />);
        expect(screen.queryByTitle('Delete Character')).not.toBeInTheDocument();
    });

    it('opens delete confirmation modal when delete clicked', () => {
        render(<CharacterSheetHeader {...defaultProps} />);
        fireEvent.click(screen.getByTitle('Delete Character'));
        expect(screen.getByText('DELETE CHARACTER')).toBeInTheDocument();
    });

    it('requires typing character name to confirm deletion', () => {
        render(<CharacterSheetHeader {...defaultProps} />);
        fireEvent.click(screen.getByTitle('Delete Character'));

        const terminateButton = screen.getByText('TERMINATE');
        expect(terminateButton).toBeDisabled();

        const input = screen.getByPlaceholderText('Type character name to confirm');
        fireEvent.change(input, { target: { value: 'Shadow Runner' } });

        expect(terminateButton).not.toBeDisabled();
    });

    it('calls onDelete when deletion confirmed', () => {
        const onDelete = vi.fn();
        render(<CharacterSheetHeader {...defaultProps} onDelete={onDelete} />);

        fireEvent.click(screen.getByTitle('Delete Character'));

        const input = screen.getByPlaceholderText('Type character name to confirm');
        fireEvent.change(input, { target: { value: 'Shadow Runner' } });

        fireEvent.click(screen.getByText('TERMINATE'));
        expect(onDelete).toHaveBeenCalled();
    });

    it('closes delete modal when cancel clicked', () => {
        render(<CharacterSheetHeader {...defaultProps} />);
        fireEvent.click(screen.getByTitle('Delete Character'));

        expect(screen.getByText('DELETE CHARACTER')).toBeInTheDocument();

        fireEvent.click(screen.getByText('CANCEL'));

        expect(screen.queryByText('DELETE CHARACTER')).not.toBeInTheDocument();
    });

    it('shows PC/NPC toggle button', () => {
        render(<CharacterSheetHeader {...defaultProps} />);
        expect(screen.getByText('PC')).toBeInTheDocument();
    });

    it('shows public/private toggle button', () => {
        render(<CharacterSheetHeader {...defaultProps} />);
        expect(screen.getByText('PRIVATE')).toBeInTheDocument();
    });

    it('calls setCharacter when name is changed', () => {
        const setCharacter = vi.fn();
        render(<CharacterSheetHeader {...defaultProps} setCharacter={setCharacter} />);

        const nameInput = screen.getByDisplayValue('Shadow Runner');
        fireEvent.change(nameInput, { target: { value: 'New Name' } });

        expect(setCharacter).toHaveBeenCalled();
    });
});
