import "./Details.scss";
import Navbar from "../Navbar/Navbar";
import { IoLogoNodejs } from "react-icons/io";
import { SiMongodb, SiFirebase, SiSocketdotio, SiReact } from "react-icons/si";

const Details = () => {
  return (
    <div className="details__container">
      <Navbar />
      <div className="info__wrapper">
        <h2 className="info__title">Project Technologies</h2>
        <div className="info__container">
          <div className="box">
            <div className="box__side box__side__front">
              <h4 className="box__title">Frontend</h4>
            </div>
            <div className="box__side box__side__back">
              <div className="box__info">
                <SiReact className="box__info__icon" />
                <p className="box__info__p">React</p>
              </div>
            </div>
          </div>

          <div className="box">
            <div className="box__side box__side__front">
              <h4 className="box__title">Backend</h4>
            </div>
            <div className="box__side box__side__back">
              <div className="box__info">
                <IoLogoNodejs className="box__info__icon" />
                <p className="box__info__p">Node.js</p>
              </div>
            </div>
          </div>

          <div className="box">
            <div className="box__side box__side__front">
              <h4 className="box__title">Socket</h4>
            </div>
            <div className="box__side box__side__back">
              <div className="box__info">
                <SiSocketdotio className="box__info__icon" />
                <p className="box__info__p">Socket.io</p>
              </div>
            </div>
          </div>

          <div className="box">
            <div className="box__side box__side__front">
              <h4 className="box__title">Database</h4>
            </div>
            <div className="box__side box__side__back">
              <div className="box__info">
                <SiMongodb className="box__info__icon" />
                <p className="box__info__p">MongoDB</p>
              </div>
              <div className="box__info">
                <SiFirebase className="box__info__icon" />
                <p className="box__info__p">Firebase</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
