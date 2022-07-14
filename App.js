import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import Task from './components/Task';
import Icon from 'react-native-vector-icons/Octicons';
import CheckIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {

  const [isVisible, setIsVisible] = useState(false)
  const [editTask, setEditTask] = useState()
  const [task, setTask] = useState();
  const [taskData, setTaskData] = useState([])
  const [mapIndex, setMapIndex] = useState()
  const [searchTask, setSearchTask] = useState()

  //MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteAllModal, setDeleteAllModal] = useState(false)

  //GETTING TO DOS
  const getTasks = () => {
    AsyncStorage.getItem('storedTasks')
    .then( res => {
      console.log(res)
      if(res == null){
        setIsVisible(true)
        return null
      }
      else if(res !==null){
        setTaskData(JSON.parse(res))
        setIsVisible(false)
      }
      else
        return false
    })
    .catch(err =>{
      console.log(err)
    })
  }

  //ADDING TO DOS
  const handleAddTask = () => {
    console.log(task)
    const newTask = [...taskData, task]
    setTask('')
    Keyboard.dismiss()
    AsyncStorage.setItem("storedTasks", JSON.stringify(newTask))
    .then(() => {
      setTaskData(newTask)
      getTasks()
    })
    .catch(err => {
      console.log(err)
    })
  } 
  //OPENS EDIT MODAL
  const openModalEditTask = (task, index) => {
    setModalVisible(true)
    setEditTask(task)
    setMapIndex(index)
    console.log(index)
  }
  // UPDATES TO DOS
  const handleEditTask = () => {
    const newTask = [...taskData]
    newTask.splice(mapIndex, 1, editTask)
    setModalVisible('false')
    Alert.alert('Notice', 'Successfully Edited!')

    AsyncStorage.setItem("storedTasks", JSON.stringify(newTask))
    .then(() => {
      setTaskData(newTask)
    })
    .catch(err => {
      console.log(err)
    })
  }
  // OPENS DELETE ALL MODAL
  const openDeleteAllModal = () => {
    setDeleteAllModal(true)
  }
  // DELETING ALL THE TO DOS
  const handleDeleteAllList = () => {
    AsyncStorage.setItem("storedTasks", JSON.stringify([]))
    .then(() => {
      setTaskData([])
      setDeleteAllModal(false)
      setIsVisible(true)
    })
  }

  useEffect(() => {
    getTasks()
  },[])
  

  return (
    <View style={styles.container}>
      {/** DELETE ALL MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteAllModal}
        onRequestClose={() => {
          setDeleteAllModal(false);
        }}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeaderDeleteAll}>Are you sure you want to delete all the list?</Text>
            <View style={styles.modalBtnWrapper}>
              <TouchableOpacity
                style={styles.btnModal}
                onPress={() => setDeleteAllModal(false)}
              >
                <Text style={styles.modalTextStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={()=> handleDeleteAllList()}
              >
                <Text style={styles.modalTextStyle}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/** END DELETE ALL MODAL */}

      {/** EDIT MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeader}>Edit Task</Text>
              <TextInput style={styles.modalInput} value={editTask} onChangeText={text => setEditTask(text)} />
              <View style={styles.modalBtnWrapper}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.modalTextStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnModal}
                onPress={() => handleEditTask()}
              >
                <Text style={styles.modalTextStyle}>Edit</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      {/** END EDIT MODAL */}

      {/** HEADER */}
      <View style={styles.taskWrapper}>
        <Text style={styles.titleHeader}>To Do List <CheckIcon name='check' size={30} color='green'/></Text>
        <ScrollView style={styles.tasks}>
        <View style={styles.searchWrapper}>
          <TextInput style={styles.searchBar} placeholder='Search Task' placeholderTextColor='gray' onChangeText={text => setSearchTask(text)}/>
          <TouchableOpacity onPress={()=> openDeleteAllModal()} style={styles.DltAllWrapper}>
            <Text><Icon name='trash' size={40} color='red'/></Text>
          </TouchableOpacity>
        </View>
        {/** TASKS LIST */}
          {isVisible && <Text  style={styles.noTasks}>You have no Todos for today!</Text>}
          {taskData.filter((item)=>{
            if(searchTask == "" || searchTask == null){
              return item
            }
            else if(item.includes(searchTask)){
              return item
            }
          }).map((item, index)=>{
            return(
              <TouchableOpacity key={index} onPress={()=> openModalEditTask(item, index)}>
                <Task getParentTask={()=>getTasks()} text={item} deleteIndex={index} getTasks={getTasks}></Task>
              </TouchableOpacity>       
            )
          })}
        </ScrollView>
      </View>
      {/** ADDING A TASK */}
      <KeyboardAvoidingView style={styles.addTaskWrapper}>
        <TextInput style={styles.inputTask} placeholder={'Add task'} placeholderTextColor='gray' value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity disabled={task == "" || task == null} onPress={()=> handleAddTask()}>
          <View style={styles.addIconWrapper}>
            <Text style={styles.addIcon}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  taskWrapper:{
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  titleHeader: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
  },
  tasks: {
    marginTop: 30,
    height: "75%"
  },
  noTasks:{
    marginTop: 20,
    fontStyle:'italic',
    color: 'black',
  },
  addTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems:'center',
  },
  inputTask: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
    color: 'black'
  },
  addIconWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addIcon: {
    color: 'gray',
    fontSize: 25,
  },
  searchBar:{
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor:'blue',
    borderWidth: 1,
    width: 150,
    color: 'black',
  },
  searchWrapper: {
    flexDirection:'row',
    justifyContent: 'space-between',
  },
  DltAllWrapper: {
    flexDirection:'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: -10,
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 7,
    backgroundColor: 'white'
  },
  DltTextStyle: {
    fontSize:20,
    color: 'red',
    fontWeight:'bold'
  },

  //STYLES FOR MODALS
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 60,
    paddingBottom: 50,
    paddingLeft: 50, 
    paddingRight: 50,
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  modalHeader: {
    marginBottom: 15,
    marginTop: -40,
    textAlign: 'center',
    color: 'black',
    fontSize: 32,
    fontWeight:'bold',
  },
  modalHeaderDeleteAll: {
    marginBottom: 15,
    marginTop: -40,
    textAlign: 'center',
    color: 'black',
    fontSize: 28,
    fontWeight:'bold',
  },
  modalInput: {
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: 'lightblue',
    borderWidth: 1,
    width: 250,
    color: 'black',
    marginBottom: 15, 
  },
  btnModal:{
    backgroundColor:'#69a8f5',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 60,
    marginRight: 20
  },
  modalBtnWrapper:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  btnCancel:{
    backgroundColor:'red',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 60,
    marginRight: 20
  },
  modalTextStyle:{
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
})