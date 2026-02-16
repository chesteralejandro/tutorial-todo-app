const listGroup = document.querySelector('ul.list-group');

listGroup.addEventListener('click', async (event) => {
	const element = event.target;

	try {
		validateElement(element);

		const listItem = element.parentElement.parentElement;
		const span = listItem.querySelector('.item-text');

		const userInput = prompt('Enter Your New Text', span.innerText);
		const itemId = element.getAttribute('data-item-id');

		validateInputText(userInput);

		await axios.post('/update-item', { text: userInput, id: itemId });

		runOptimisticUpdate(span, userInput);
	} catch (error) {
		console.warn(error.message);
	}
});

function validateElement(element) {
	const editButtonClass = 'edit-me';
	const isNotEditButton = !element.classList.contains(editButtonClass);

	if (isNotEditButton) {
		throw new Error('Element is not the edit button.');
	}
}

function validateInputText(inputText) {
	const isInputEmpty = !inputText;

	if (isInputEmpty) {
		throw new Error('Input must not be empty.');
	}
}

function runOptimisticUpdate(element, newText) {
	element.innerText = newText;
}
