import './toggle.css';

type ToggleProps = {
  action: (checked: boolean) => void;
  data: boolean;
};

const Toggle = ({ action, data }: ToggleProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    action(isChecked);
  };

  console.log(data)

  return (
    <div className='toggle__container'>
      <label className='toggle__switch'>
        <input type='checkbox' id='toggle' checked={data} onChange={handleChange} />
        <span className='toggle__slider' />
      </label>
    </div>
  );
};

export default Toggle;
