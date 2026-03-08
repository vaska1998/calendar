import styled from '@emotion/styled';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppUser } from '../../contexts/user.context.tsx';

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Logo = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  cursor: pointer;
  user-select: none;
`;

const RightSection = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s;

  &:hover {
    background: #f5f5f5;
  }
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f29d38;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;

const UserName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #333;
`;

const ChevronDown = styled.span`
  font-size: 10px;
  color: #999;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 180px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  z-index: 1000;
`;

const DropdownItem = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 14px;
  font-size: 13px;
  color: ${({ danger }) => (danger ? '#e53935' : '#333')};
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;

  &:hover {
    background: ${({ danger }) => (danger ? '#fff5f5' : '#f5f5f5')};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 4px 0;
`;

const HeaderMenu = () => {
  const { user, signOut } = useAppUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const claims = user?.claims;
  const initials = claims ? `${claims.firstName?.[0] ?? ''}${claims.lastName?.[0] ?? ''}` : '?';
  const displayName = claims ? `${claims.firstName} ${claims.lastName}`.trim() || claims.email : '';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <Header>
      <LeftSection>
        <Logo onClick={() => navigate('/calendar')}>📅 Calendar</Logo>
      </LeftSection>

      <RightSection ref={dropdownRef}>
        <UserButton onClick={() => setOpen((v) => !v)}>
          <Avatar>{initials}</Avatar>
          <UserName>{displayName}</UserName>
          <ChevronDown>▾</ChevronDown>
        </UserButton>

        {open && (
          <Dropdown>
            <DropdownItem
              onClick={() => {
                setOpen(false);
                navigate('/profile');
              }}
            >
              👤 Profile
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setOpen(false);
                navigate('/calendar');
              }}
            >
              📅 Calendar
            </DropdownItem>
            <Divider />
            <DropdownItem danger onClick={handleLogout}>
              🚪 Log out
            </DropdownItem>
          </Dropdown>
        )}
      </RightSection>
    </Header>
  );
};

export default HeaderMenu;
