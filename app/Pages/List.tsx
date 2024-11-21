import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  poster_url: string;
  updatedAt?: string;
}

const List = () => {
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [toWatchMovies, setToWatchMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        const response = await fetch('https://api.rapidmock.com/api/vikuman/v1/mylist');
        if (!response.ok) {
          throw new Error('Failed to fetch list');
        }
        const data = await response.json();

        setWatchedMovies(data.Watched || []);
        setToWatchMovies(data?.["To Watch"] || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyList();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0163d2" />
        <Text>Loading your list...</Text>
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

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieItem}>
      <Image source={{ uri: item.poster_url }} style={styles.movieImage} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>

        <Text style={styles.updatedAt}>
          {item.updatedAt ? item.updatedAt : 'Date not found'}
        </Text>

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Watched</Text>
      <ScrollView horizontal contentContainerStyle={styles.horizontalList}>
        {watchedMovies.length > 0 ? (
          watchedMovies.map((movie) => (
            <View key={movie.id} style={styles.movieContainer}>
              {renderMovieItem({ item: movie })}
            </View>
          ))
        ) : (
          <Text>No watched movies.</Text>
        )}
      </ScrollView>

      <Text style={styles.sectionTitle}>To Watch</Text>
      <ScrollView horizontal contentContainerStyle={styles.horizontalList}>
        {toWatchMovies.length > 0 ? (
          toWatchMovies.map((movie) => (
            <View key={movie.id} style={styles.movieContainer}>
              {renderMovieItem({ item: movie })}
            </View>
          ))
        ) : (
          <Text>No movies to watch.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  horizontalList: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  movieContainer: {
    marginRight: 1,
  },
  movieItem: {
    width: 120,
    alignItems: 'center',
    marginBottom: 10,
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  movieInfo: {
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  updatedAt: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  movieType: {
    fontSize: 12,
    color: 'gray',
  },
});

export default List;
