import React from 'react';
import { RefreshControl, View, Image, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { Container, Content, List, ListItem, Thumbnail, Text, Body, Header, Title, Button, Right } from 'native-base';
import DatePicker from 'react-native-datepicker';

class PembayaranScreen extends React.Component {
  constructor()
    {
      super();
        this.state = { 
          nim: '',
          nohp: '',
          nama: '',
          tanggal: '',
          kelamin: '', 
          ActivityIndicator_Loading: false, 
        }
    }
    //fungsi mengirim data ke database
    Insert_Data_Into_MySQL = () =>
    {
        this.setState({ ActivityIndicator_Loading: true }, () =>
        {
          //mengirim data ke database melalui api
            fetch('https://pridenjoy2nd.000webhostapp.com/mahasiswa/kirimData.php',
            {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  nim: this.state.nim,
                  nohp: this.state.nohp,
                  nama: this.state.nama,
                  tanggal: this.state.tanggal,
                })
 
            }).then((response) => response.json()).then((responseJsonFromServer) =>
            {
                alert(responseJsonFromServer);
                this.setState({ ActivityIndicator_Loading: false });
            }).catch((error) =>
            {
                console.error(error);
                /*Alert.alert(
                  'Oops!',
                  'Something went wrong!',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  { cancelable: false }
                )*/
                this.setState({ ActivityIndicator_Loading: false});
            });
        });
    }

  render() {
    return (
      <KeyboardAvoidingView behavior = "padding" style = { styles.MainContainer }>
        <View>
          <Image source = {require('./logo.png')} style = {{ height: 140, width: 140, marginBottom: 30}}/>
        </View>

        <TextInput 
          placeholder = "NIM Mahasiswa"
          placeholderTextColor = '#C7C7CD'
          style = { styles.TextInputStyleClass } 
          underlineColorAndroid = "transparent"
          returnKeyType = "next"
          keyboardType = "numeric"         
          onChangeText = {(TextInputText) => this.setState({ nim: TextInputText })} />

        <TextInput 
          placeholder = "No Handphone"
          placeholderTextColor = '#C7C7CD'
          style = { styles.TextInputStyleClass } 
          underlineColorAndroid = "transparent"
          returnKeyType = "next"
          keyboardType = "numeric"
          onChangeText = {(TextInputText) => this.setState({ nohp: TextInputText })} />

        <TextInput 
          placeholder = "Nama Mahasiswa"
          placeholderTextColor = '#C7C7CD'
          style = { styles.TextInputStyleClass } 
          underlineColorAndroid = "transparent"
          returnKeyType = "go"
          autoCapitalize = "words"
          onChangeText = {(TextInputText) => this.setState({ nama: TextInputText })} />
        
        <DatePicker
          style={{ width: '95%', height: 40, marginBottom: 10 }}
          date = {this.state.tanggal}
          mode = "date"
          placeholder = "Tanggal Pembayaran"
          format = "YYYY-MM-DD"
          minDate = "2018-04-12"
          maxDate = "2018-05-12"
          confirmBtnText = "Confirm"
          cancelBtnText = "Cancel"
          showIcon = {false}
          customStyles = {{
            dateInput: {
              borderColor: '#0722e5',
              borderWidth: 1,
              borderRadius: 7
            },
            placeholderText: {
              color: '#C7C7CD'
            }
          }}
          onDateChange = {(date) => {this.setState({tanggal: date})}}
        />

        <TouchableOpacity 
          activeOpacity = { 0.5 }
          style = { styles.TouchableOpacityStyle } 
          onPress = { this.Insert_Data_Into_MySQL }>

        <Text style = { styles.TextStyle }>Input</Text>

        </TouchableOpacity>
          {
            this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#2196F3' size='large'style={styles.ActivityIndicatorStyle} /> : null
          }       
      </KeyboardAvoidingView> //penutup containerMain 
    );
  }
}

class DataScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      refreshing: false,
      ActivityIndicator_Loading: false, 
    };
  }

  componentDidMount()  {
    this.setState({ ActivityIndicator_Loading : true }, () =>
    {
        this.setState({refreshing: true});
        const url = 'https://pridenjoy2nd.000webhostapp.com/mahasiswa/getData.php';
       //this.setState({ loading: true });
        fetch (url)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("comp");
          console.log(responseJson);
          this.setState({
            data: responseJson,
            error: responseJson.error || null,
            loading: false,
            refreshing: false,
            ActivityIndicator_Loading: false, 
          });
        }
      );
    });
  }
  _keyExtractor = (item, index) => item.nim;

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Data Pembayaran</Title>
          </Body>
        </Header>
        <Content
          refreshControl={
            <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.componentDidMount.bind(this)}
          />}
        >
          <List dataArray={this.state.data} renderRow={(item) =>
             <ListItem >
              <Thumbnail square size={80} source={require('./user.png')} />
              <Body>
                <Text>{item.nim}</Text>
                <Text note>Nama : {item.nama}</Text>
                <Text note>No Handphone : {item.nohp}</Text>
                <Text note>Tgl Pembayaran : {item.tanggal}</Text>
              </Body>
            </ListItem> 
            }
          />
        </Content>
      </Container>
    );
  }
}

export default TabNavigator(
  {
    Pembayaran: { screen: PembayaranScreen},
    Data: { screen: DataScreen },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Pembayaran') {
          iconName = `ios-cash${focused ? '' : '-outline'}`;
        } else if (routeName === 'Data') {
          iconName = `ios-people${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={30} color={tintColor} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#0722e5',
      inactiveTintColor: 'gray',
    },
    animationEnabled: false,
    swipeEnabled: false,
  }
);

const styles = StyleSheet.create(
{
    MainContainer:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20

    },
 
    TextInputStyleClass:
    {
      textAlign: 'center',
      height: 40,
      backgroundColor : 'white',
      borderWidth: 1,
      borderColor: '#0722e5',
      borderRadius: 7 ,
      marginBottom: 10,
      width: '95%'
    },

    TouchableOpacityStyle:
    {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#0722e5',
      borderColor: '#0722e5',
      marginBottom: 20,
      height: 40,
      width: '70%',
      borderRadius: 7, 
      borderWidth: 1
    },
 
    TextStyle:
    {
      color: 'white',
      textAlign: 'center',
      fontSize: 16
    },

    ActivityIndicatorStyle:
    {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      //justifyContent: 'center'
    
    }, 
})