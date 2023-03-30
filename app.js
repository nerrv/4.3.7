const input = document.querySelector('.search__input');
const results = document.querySelector('.search__results');
const cards = document.querySelector('.search__cards');

function createElement(elementTag, elementClass) {
	const element = document.createElement(elementTag);
	if (elementClass) {
		element.classList.add(elementClass);
	}
	return element;
}

function showResults(data) {
	removeResults();
	data.items.forEach(el => {
		const result = createElement('li', 'search__result');
		result.textContent = el.name;
		results.appendChild(result);
		result.addEventListener('click', createCard.bind(this, el));
	});
}

function removeResults() {
	results.textContent = '';
}

function createCard(el) {
	removeResults();

	const card = createElement('li', 'search__card');
	const cardInfo = createElement('div', 'search__text');
	const closeBtn = createElement('button', 'btn-close');

	cardInfo.textContent = `Name: ${el.name}\n`;
	cardInfo.textContent += `Owner: ${el.owner.login}\n`;
	cardInfo.textContent += `Stars: ${el.stargazers_count}\n`;

	card.appendChild(cardInfo);
	card.appendChild(closeBtn);
	cards.appendChild(card);

	closeBtn.addEventListener('click', () => closeBtn.parentElement.remove());

	return card;
}

async function searchRepos() {
	if (input.value) {
		const url = `https://api.github.com/search/repositories?q=${input.value}&per_page=5`;
		try {
			await fetch(url).then(res => {
				if (res.ok) {
					res.json().then(res => {
						showResults(res);
					});
				} else {
					removeResults();
				}
			});
		} catch(err) {
			console.log(err);
		}
	} else {
		removeResults();
	}
}

function debounce(fn, debounceTime) {
	let timeout;
	return function() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn.apply(this, arguments);
		}, debounceTime);
	}
}

const debounceSearch = debounce(searchRepos, 800);

input.addEventListener('keyup', () => {
	if (input.value.charAt(0) !== ' ') {
    debounceSearch();
  }
});