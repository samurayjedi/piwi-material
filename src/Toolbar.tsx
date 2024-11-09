import styled from '@emotion/native';

const Toolbar = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  padding: theme.spacing(1),
  paddingBottom: 0,
  alignItems: 'center',
}));

export default Toolbar;
