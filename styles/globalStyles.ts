// styles/globalStyles.ts
import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginTop: 10,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },
  subValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },

  saldosContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginVertical: 20,
  gap: 10,
},

saldoBox: {
  flex: 1,
  backgroundColor: '#f1f5f9',
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  minWidth: 90,
},

saldoLabel: {
  fontSize: 12,
  color: '#334155',
  marginBottom: 2,
  textAlign: 'center',
},

saldoValor: {
  fontSize: 14,
  fontWeight: '600',
  color: '#0f172a',
  textAlign: 'center',
},

});



export default globalStyles;
