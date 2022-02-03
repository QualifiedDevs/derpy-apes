import {styled} from '@mui/material/styles';
import {Container, Box, Typography} from '@mui/material';

const Reminder = styled((props) => {
    return (
        <Container {...props}>
            <Typography variant="h3">
                Presale on February 4th at 6pm EST
            </Typography>
        </Container>
    );
})`
text-align: center;
text-transform: uppercase;
margin: 5rem 1rem 6rem;
`;

export default Reminder;
