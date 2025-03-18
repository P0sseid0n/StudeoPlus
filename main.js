function createCalendarEventURL(disciplina, polo, data) {
	const titulo = `Prova - ${disciplina}`
	const localizacao = `Unicesumar - Polo ${polo}`
	const dataInicioIso = data.toISOString().replace(/-|:|\.\d+/g, '')
	data.setHours(data.getHours() + 1)
	const dataFimIso = data.toISOString().replace(/-|:|\.\d+/g, '')

	const url = new URL('https://www.google.com/calendar/render')
	url.searchParams.set('action', 'TEMPLATE')
	url.searchParams.set('text', titulo)
	url.searchParams.set('dates', `${dataInicioIso}/${dataFimIso}`)
	url.searchParams.set('location', localizacao)

	return url.toString()
}

function main() {
	function getDisciplina() {
		const disciplinaContainer = document.querySelector('[ng-repeat="la in vm.listaAtiva"]')
		if (!disciplinaContainer) return ''

		const disciplinaString = disciplinaContainer.querySelector('.lista-disciplina.ng-binding')?.textContent || ''
		return disciplinaString.replace('Disciplina: ', '').split(' | ')[0]
	}

	function getLocal() {
		const localContainer = document.querySelector('[ng-if="la.flAgendado"]')
		if (!localContainer) return ''

		const local = localContainer.querySelectorAll('div')[2]
		const localString = local.querySelector('p')?.textContent.trim().replace('Local: ', '').split(' - ') || []

		return localString.length === 2 ? `${localString[1]} - ${localString[0]}` : ''
	}

	function getLocalDateTime() {
		const dateTimeContainer = document.querySelector('[ng-if="la.flAgendado"]')
		if (!dateTimeContainer) return new Date()

		const dateTime = dateTimeContainer.querySelectorAll('div')[1]
		const dateString = dateTime.querySelectorAll('span')[0]?.textContent.trim() || ''
		const [dia, mes, ano] = dateString.split('/').map(Number)
		const data = new Date(ano, mes - 1, dia)

		const timeString = dateTime.querySelectorAll('span')[1]?.textContent.trim() || ''
		const horaInicio = Number(timeString.split(':')[0])

		data.setHours(horaInicio)
		return data
	}

	const provaContainer = Array.from(document.querySelectorAll('a')).find(el =>
		el.textContent.includes('Editar Agendamento')
	)?.parentElement

	if (!provaContainer) return

	const existingLink = document.querySelector('#prova-to-calendar')
	if (existingLink) return

	const link = document.createElement('a')
	link.id = 'prova-to-calendar'
	link.target = '_blank'
	link.classList.add('btn', 'btn-sm', 'btn-info', 'btn-rounded', 'm-t-20', 'btn-cons')

	const icon = document.createElement('i')
	icon.classList.add('fa', 'fa-calendar-plus-o')
	link.appendChild(icon)

	const span = document.createElement('span')
	span.textContent = ' Adicionar ao Calendario'
	link.appendChild(span)

	const url = createCalendarEventURL(getDisciplina(), getLocal(), getLocalDateTime())
	link.href = url

	provaContainer.appendChild(link)
}

function isDone() {
	return !!document.querySelector('#prova-to-calendar')
}

if (!isDone()) {
	main()
	setInterval(() => {
		console.log('calendarioProva', isDone())
		if (!isDone()) main()
	}, 1000)
}
