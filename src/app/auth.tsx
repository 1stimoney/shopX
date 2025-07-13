import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../lib/supabase'
import { Toast } from 'react-native-toast-notifications'
import { useAuth } from '../providers/auth-provider'
import { Redirect } from 'expo-router'

const authSchema = zod.object({
  email: zod.string().email({ message: 'Invalid email address' }),
  password: zod
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export default function Auth() {
  const { session } = useAuth()

  if (session) return <Redirect href='/' />

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signIn = async (data: zod.infer<typeof authSchema>) => {
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      alert(error.message)
    } else {
      Toast.show('Sign in successful!', {
        type: 'success',
        placement: 'top',
        animationType: 'slide-in',
        duration: 2000,
      })
    }
  }

  const signUp = async (data: zod.infer<typeof authSchema>) => {
    const { error } = await supabase.auth.signUp(data)

    if (error) {
      alert(error.message)
    } else {
      Toast.show('Sign Up successful!', {
        type: 'success',
        placement: 'top',
        animationType: 'slide-in',
        duration: 2000,
      })
    }
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Please sign in to continue</Text>
          <Controller
            name='email'
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder='Email Address'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor='#aaa'
                  autoCapitalize='none'
                  editable={!formState.isSubmitting}
                  autoComplete='email'
                  keyboardType='email-address'
                />
                {error && <Text style={styles.error}>{error.message}</Text>}
              </>
            )}
          />
          <Controller
            name='password'
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder='Password'
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor='#aaa'
                  autoCapitalize='none'
                  editable={!formState.isSubmitting}
                  keyboardType='default'
                />
                {error && <Text style={styles.error}>{error.message}</Text>}
              </>
            )}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(signIn)}
            disabled={formState.isSubmitting}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.signUpButton]}
            onPress={handleSubmit(signUp)}
          >
            <Text style={[styles.buttonText, styles.signUpButtonText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginBottom: 32,
  },
  input: {
    width: '90%',
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#6a1b9a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: '90%',
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
  },
  signUpButtonText: {
    color: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'left',
    width: '90%',
  },
})
