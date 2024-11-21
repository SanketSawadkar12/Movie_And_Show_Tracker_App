import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  type: string;
  rating: number;
  release_date: string;
  genre: string[];
}

const MovieDetails = ({ route }: any) => {
  const { id } = route.params;
  console.log(id);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      console.log(id);
      try {
        const response = await fetch(`https://api.rapidmock.com/api/vikuman/v1/movies?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        console.log(data);
        setMovie(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, []);

  const handleAddToList = async (status: string) => {
    try {
      const response = await fetch('https://api.rapidmock.com/api/vikuman/v1/mylist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to add movie to list');
      }

      Alert.alert('Success', `Movie marked as ${status}`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0163d2" />
        <Text>Loading movie details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centered}>
        <Text>No movie details found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: movie.poster_url }} style={styles.movieImage} />
      <Text style={styles.movieTitle}>{movie.title}</Text>
      <Text style={styles.movieDescription}>{movie.description}</Text>
      <Text style={styles.movieType}>
        <Text style={styles.bold}>Type:</Text> {movie.type}
      </Text>
      <Text style={styles.movieDetails}>
        <Text style={styles.bold}>Rating:</Text> {movie.rating}
      </Text>
      <Text style={styles.movieDetails}>
        <Text style={styles.bold}>Release Date:</Text> {movie.release_date}
      </Text>
      <Text style={styles.movieDetails}>
        <Text style={styles.bold}>Genre:</Text> {movie.genre.join(', ')}
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Watched" onPress={() => handleAddToList('Watched')} color="#28a745" />
        <Button title="To Watch" onPress={() => handleAddToList('To Watch')} color="#007bff" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  movieImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  movieDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  movieType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 10,
  },
  movieDetails: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default MovieDetails;
