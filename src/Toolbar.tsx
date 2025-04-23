import styled from '@emotion/native';

const Toolbar = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  paddingLeft: 12,
  paddingRight: 8,
  paddingTop: 2,
  paddingBottom: 0,
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

export default Toolbar;
