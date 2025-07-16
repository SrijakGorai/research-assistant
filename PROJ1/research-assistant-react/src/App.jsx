import { useState } from 'react';
import './App.css';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';

function App() {
  const [researchText, setResearchText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!researchText.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/research/process', {
        content: researchText,
        operation: 'summarize'  // ✅ required by your backend
      });

 
      setSummary(typeof response.data === 'string' ? response.data : 'No summary returned.');

    } catch (error) {
      setError('Failed to summarize the text. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Research Assistant
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Paste Research Text"
          value={researchText}
          onChange={(e) => setResearchText(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleSummarize}
          disabled={!researchText || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Summarize'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {summary && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Summary:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={summary}
            inputProps={{ readOnly: true }}
          />

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigator.clipboard.writeText(summary)}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
