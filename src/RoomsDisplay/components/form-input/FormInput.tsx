import type { FormStateType } from '../../RoomsDisplay';
import './formInput.css';

type FormInputProps = {
  name: string;
  handleSubmit: Function;
  setFormState: React.Dispatch<React.SetStateAction<FormStateType>>;
  type: string;
  maxLength: number;
};

const FormInput = ({ name, handleSubmit, type, setFormState, maxLength }: FormInputProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: string): void => {
    if (type === 'Room') {
      setFormState(prev => ({ ...prev, newRoomName: e.target.value }));
    } else {
      setFormState(prev => ({ ...prev, newUserName: e.target.value }));
    }
  };

  return (
    <div className='form-input__create-container'>
      <form onSubmit={(e)=> handleSubmit(e)}>
        <input
          type='text'
          className='form-input__create-input'
          placeholder={`${type} Name`}
          value={name}
          onChange={(e)=> handleChange(e, type)}
          data-testid='formInput-input'
          maxLength={maxLength}
        />
        <button
          className='form-input__create'
          type='submit'
        >
          Create {type}
        </button>
      </form>
    </div>
  );
};

export default FormInput;