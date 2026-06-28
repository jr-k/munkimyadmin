import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n';
import * as S from './styled';

type ConfirmModalProps = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    requireConfirmationCheckbox?: boolean;
    confirmationLabel?: string;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmModal({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel,
    requireConfirmationCheckbox = false,
    confirmationLabel,
    onClose,
    onConfirm,
}: ConfirmModalProps) {
    const { t } = useI18n();
    const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
    const checkboxRef = useRef<HTMLInputElement | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setConfirmed(false);
        window.requestAnimationFrame(() => {
            if (requireConfirmationCheckbox) {
                checkboxRef.current?.focus();
                return;
            }

            confirmButtonRef.current?.focus();
        });

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener('keydown', closeOnEscape);

        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [open, onClose, requireConfirmationCheckbox]);

    if (!open) {
        return null;
    }

    return (
        <S.Overlay
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <S.Dialog role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" onClick={(event) => event.stopPropagation()}>
                <S.Icon aria-hidden="true">!</S.Icon>
                <S.Content>
                    <S.Title id="confirm-modal-title">{title}</S.Title>
                    <S.Description>{description}</S.Description>
                    {requireConfirmationCheckbox ? (
                        <S.ConfirmationLabel>
                            <S.ConfirmationCheckbox
                                ref={checkboxRef}
                                type="checkbox"
                                checked={confirmed}
                                onChange={(event) => setConfirmed(event.target.checked)}
                            />
                            <span>{confirmationLabel ?? t('common.confirmBulkDelete')}</span>
                        </S.ConfirmationLabel>
                    ) : null}
                </S.Content>
                <S.Actions>
                    <S.CancelButton type="button" onClick={onClose}>
                        {cancelLabel ?? t('common.cancel')}
                    </S.CancelButton>
                    <S.ConfirmButton
                        type="button"
                        ref={confirmButtonRef}
                        disabled={requireConfirmationCheckbox && !confirmed}
                        onClick={onConfirm}
                    >
                        {confirmLabel ?? t('common.delete')}
                    </S.ConfirmButton>
                </S.Actions>
            </S.Dialog>
        </S.Overlay>
    );
}
