// App.js
import React, { useState } from 'react'
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native'

const ChatSupport = () => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const sendMessage = () => {
    if (message.trim() !== '') {
      setMessages([
        ...messages,
        { id: messages.length.toString(), text: message },
      ])
      setMessage('')
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: 'flex-end',
              padding: 10,
              backgroundColor: '#0084ff',
              margin: 5,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: 'white' }}>{item.text}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderRadius: 5, padding: 8 }}
          placeholder="Type your message"
          value={message}
          onChangeText={(text) => setMessage(text)}
          onSubmitEditing={sendMessage}
          multiline={true}
          returnKeyType="send"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  )
}

export default ChatSupport
