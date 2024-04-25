import { Flex, Box, Text } from '@chakra-ui/react';

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Flex
        flexDirection='column'
        bg='gray.100'
        border='1px solid #D69E2E'
        padding='0.3rem'
      >
        <p className='label'>{`${label}`}</p>
        <div>
          {payload.map((pld, index) => (
            <div style={{ display: 'inline-block', padding: 10 }} key={index}>
              <div style={{ color: 'rgba(15, 22, 97, 0.9)' }}>{pld.value}</div>
              {/* <div>{pld.dataKey}</div> */}
            </div>
          ))}
        </div>
      </Flex>
    );
  }

  return null;
};
