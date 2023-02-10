import React, { useState, useEffect } from "react";
import Header from "./Header";
import Figure from "./Figure";
import WrongLetters from "./WrongLetters";
import Word from "./Word";
import Popup from "./Popup";
import Notification from "./Notification";
import axios from "axios";
import "../App.css";

const Hangman = () => {
	const [playable, setPlayable] = useState(true);
	const [correctLetters, setCorrectLetters] = useState([]);
	const [wrongLetters, setWrongLetters] = useState([]);
	const [showNotification, setShowNotification] = useState(false);
	const [selectedWord, setSelectedWord] = useState("");

	const fetchingWords = async () => {
		axios
			.get("https://random-word-form.herokuapp.com/random/noun")
			.then(
				(response) =>
					setSelectedWord(response.data[0]) /* console.log(response) */
			)
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		fetchingWords();
	}, []);

	console.log(selectedWord);

	let word = selectedWord;

	const notificationMessage = (setter) => {
		setter(true);
		setTimeout(() => [setter(false)], 2000);
	};

	const checkWin = (correct, wrong, word) => {
		if (word.length > 0) {
			let status = "win";
			word.split("").forEach((letter) => {
				if (!correct.includes(letter)) {
					status = "";
				}
			});

			if (wrong.length === 6) status = "lose";

			return status;
		}
	};

	useEffect(() => {
		const handleKeydown = (event) => {
			const { key, keyCode } = event;
			if (playable && keyCode >= 65 && keyCode <= 90) {
				let letter = key.toLowerCase();
				if (word.includes(letter)) {
					if (!correctLetters.includes(letter)) {
						setCorrectLetters((currentLetters) => [...currentLetters, letter]);
					} else {
						notificationMessage(setShowNotification);
					}
				} else {
					if (!wrongLetters.includes(letter)) {
						setWrongLetters((currentLetters) => [...currentLetters, letter]);
					} else {
						notificationMessage(setShowNotification);
					}
				}
			}
		};
		window.addEventListener("keydown", handleKeydown);

		return () => window.removeEventListener("keydown", handleKeydown);
	}, [correctLetters, wrongLetters, playable, word]);

	const playAgain = () => {
		setPlayable(true);
		setCorrectLetters([]);
		setWrongLetters([]);
		fetchingWords();
	};

	return (
		<div className="hangman-container">
			<Header />
			<div className="game-container">
				<Figure wrongLetters={wrongLetters} />
				<WrongLetters wrongLetters={wrongLetters} />
				<Word selectedWord={word} correctLetters={correctLetters} />
			</div>
			<Popup
				correctLetters={correctLetters}
				wrongLetters={wrongLetters}
				selectedWord={word}
				setPlayable={setPlayable}
				playAgain={playAgain}
				checkWin={checkWin}
			/>
			<Notification showNotification={showNotification} />
		</div>
	);
};

export default Hangman;
