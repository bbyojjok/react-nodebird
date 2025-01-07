import React, { useCallback } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Row, Col, Input } from 'antd';
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput] = useInput('');

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  const menuItems = [
    {
      key: 'node bird',
      label: <Link href="/">node bird</Link>,
    },
    {
      key: 'profile',
      label: <Link href="/profile">profile</Link>,
    },
    {
      key: 'search',
      label: (
        <SearchInput
          enterButton
          value={searchInput}
          onChange={onChangeSearchInput}
          onSearch={onSearch}
        />
      ),
    },
    {
      key: 'signup',
      label: <Link href="/signup">signup</Link>,
    },
  ];

  return (
    <div>
      <Menu mode="horizontal" items={menuItems} />
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://github.com/bbyojjok" target="_blank" rel="noreferrer noopener">
            made by stlee
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
