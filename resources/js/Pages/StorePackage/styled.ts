import styled from 'styled-components';
import {
  AvailabilityBadge,
  FlashMessages,
  ManifestNotice,
  Meta,
  Page,
  Title as StoreTitle,
} from '../Store/styled';

export {
  AvailabilityBadge,
  FlashMessages,
  ManifestNotice,
  Page,
};

export const Title = styled(StoreTitle)`
`;

export const PackageContent = styled.div`
  box-sizing: border-box;
  flex: 1 1 auto;
  margin: 0 auto;
  max-width: 820px;
  min-height: 0;
  overflow-y: auto;
  padding: 0 0 40px;
  width: 100%;

  @media (max-width: 860px) {
    overflow: visible;
    padding-bottom: 28px;
  }
`;

export const PackagePanel = styled.section`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow: 0 18px 48px rgb(15 23 42 / 8%);
  margin-top: 12px;
  padding: 24px;
  width: 100%;

  > * + * {
    margin-top: 20px;
  }
`;

export const ContentBackLink = styled.a`
  align-items: center;
  color: #2563eb;
  display: inline-flex;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;

  span {
    margin-right: 8px;
  }

  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

export const PackageHero = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 18px;

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const PackageIconWrap = styled.div`
  align-items: flex-start;
  padding-top: 32px;
  display: flex;
  flex: 0;
  justify-content: flex-start;
`;

export const PackageIntro = styled.div`
  flex: 1 1 auto;
  min-width: 0;

  > * + * {
    margin-top: 8px;
  }

  > p {
    margin-top: 14px;
  }

  @media (max-width: 720px) {
    width: 100%;
  }
`;

export const PackageManifestNotice = styled(ManifestNotice)`
  margin-bottom: 18px;
`;

export const PackageTopRow = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;

  ${AvailabilityBadge} {
    flex: 0 0 auto;
  }
`;

export const PackageEyebrow = styled.span`
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const PackageTitle = styled.h1`
  color: #0f172a;
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.05;
  margin: 0;
`;

export const PackageMeta = styled(Meta)`
  font-size: 15px;
`;

export const Description = styled.p`
  color: #334155;
  font-size: 16px;
  line-height: 1.65;
  margin: 0;
`;

export const ActivationCard = styled.div`
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  padding: 18px;

  > div {
    min-width: 0;
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const ActivationTitle = styled.h2`
  color: #0f172a;
  font-size: 20px;
  margin: 0;
`;

export const ActivationText = styled.p`
  color: #64748b;
  margin: 5px 0 0;
`;

export const ActivationButton = styled.button<{ $tone: 'success' | 'danger' }>`
  background: ${({ $tone }) => ($tone === 'success' ? '#16a34a' : '#dc2626')};
  border: 0;
  border-radius: 999px;
  box-shadow: ${({ $tone }) => (
    $tone === 'success' ? '0 14px 30px rgb(22 163 74 / 24%)' : '0 14px 30px rgb(220 38 38 / 22%)'
  )};
  color: #ffffff;
  cursor: pointer;
  flex: 0 0 auto;
  font-size: 15px;
  font-weight: 900;
  min-width: 140px;
  padding: 12px 22px;
  transition: background-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease, transform 160ms ease;

  &:hover:not(:disabled) {
    background: ${({ $tone }) => ($tone === 'success' ? '#15803d' : '#b91c1c')};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid ${({ $tone }) => (
      $tone === 'success' ? 'rgb(34 197 94 / 28%)' : 'rgb(248 113 113 / 30%)'
    )};
    outline-offset: 3px;
  }

  &:disabled {
    background: #94a3b8;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.72;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;
