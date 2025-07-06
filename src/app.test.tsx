import { render, screen } from "@testing-library/react";
import App from "./App";

describe('App', ()=>{
  it('This is a test', ()=>{
    render(<App/>);
    const heading = screen.getByText(/Not to Interrupt/i);
    expect(heading).toBeVisible();
  });
});