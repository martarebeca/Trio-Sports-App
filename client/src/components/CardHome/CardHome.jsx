import Card from 'react-bootstrap/Card';

export const CardHome = ({data}) => {
  return (
    <Card className='home-card' style={{ width: '18rem', height: '400px' }}>
      <Card.Img variant="top" src={`src/assets/images/${data?.img}`} />
      <Card.Body>
        <Card.Title>{data?.title}</Card.Title>
        <Card.Text className='mb-auto'>
          {data?.text}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}