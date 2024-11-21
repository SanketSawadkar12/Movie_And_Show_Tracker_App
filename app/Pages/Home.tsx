import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

interface Movie {
  id: number;
  title: string;
  Description: string;
  poster_url: string;
  type: string;
}

const Home = ({ navigation }: any) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  const [filterOption, setFilterOption] = useState<'All' | 'Movie' | 'Series'>('All');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://api.rapidmock.com/api/vikuman/v1/movies/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllMovies(data);
        setFilteredMovies(data);
      } catch (error: any) {
        console.error('Error fetching movies:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterAndSortMovies(query, filterOption, isAscending);
  };

  const handleFilter = (option: 'All' | 'Movie' | 'Series') => {
    setFilterOption(option);
    filterAndSortMovies(searchQuery, option, isAscending);
  };

  const toggleSortOrder = () => {
    setIsAscending((prev) => !prev);
    filterAndSortMovies(searchQuery, filterOption, !isAscending);
  };

  const filterAndSortMovies = (
    query: string,
    filter: 'All' | 'Movie' | 'Series',
    ascending: boolean
  ) => {
    let filtered = allMovies;


    if (query) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
    }


    if (filter !== 'All') {
      filtered = filtered.filter((movie) => movie.type.toLowerCase() === filter.toLowerCase());
    }


    filtered = filtered.sort((a, b) =>
      ascending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );

    setFilteredMovies(filtered);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handlePress = (id: number) => {
    navigation.navigate('MovieDetails', { id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Movies / Shows . . ."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>


      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={toggleSortOrder}
          activeOpacity={0.7}
        >
          <Text style={styles.sortText}>Sort</Text>
          <Ionicons
            name={isAscending ? 'arrow-down' : 'arrow-up'}
            size={15}
            color="#333"
          />
        </TouchableOpacity>

        <View style={styles.option}>
          <Picker
            selectedValue={filterOption}
            onValueChange={handleFilter}
            style={styles.picker}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Movie" value="Movie" />
            <Picker.Item label="Show" value="Show" />
          </Picker>
        </View>
      </View>


      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieItem}
            onPress={() => handlePress(item.id)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: item.poster_url }}
              style={styles.movieImage}
            />
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text>{item.Description}</Text>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{item.type}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => <Text>No movies available.</Text>}

      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },

  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,

  },
  sortButton: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  sortText: {
    fontSize: 14,
    marginRight: 8,
  },
  option: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    marginHorizontal: 10,
  },
  optionLabel: {
    fontSize: 14,
    marginBottom: 1,
  },
  picker: {
    height: 30,
    width: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  movieItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieImage: {
    width: 100,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
  },
});

export default Home;
