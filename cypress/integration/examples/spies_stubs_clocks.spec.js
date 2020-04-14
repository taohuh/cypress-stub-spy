/// <reference types="cypress" />

context('Spies, Stubs, and Clock', () => {
  it('cy.spy() - wrap a method in a spy', () => {
    // https://on.cypress.io/spy
    cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')

    const obj = {
      foo () {},
    }

    const person = {
      getName() {},
      getAge() {},
    }

    const spyFoo = cy.spy(obj, 'foo').as('foo')
    const spyGetName = cy.spy(person, 'getName').as('getName');
    const spyGetAge = cy.spy(person, 'getAge').as('getAge');

    obj.foo()
    person.getName()
    person.getAge()

    expect(spyFoo).to.be.called
    expect(spyGetName).to.be.called
    expect(spyGetAge).to.be.called
  })

  it('cy.spy() retries until assertions pass', () => {
    cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')

    const obj = {
      /**
       * Prints the argument passed
       * @param x {any}
      */
      foo (x) {
        console.log('obj.foo called with', x)
      },
    }

    cy.spy(obj, 'foo').as('foo')

    setTimeout(() => {
      obj.foo('first')
    }, 500)

    setTimeout(() => {
      obj.foo('second')
    }, 2500)

    cy.get('@foo').should('have.been.calledTwice')

    const person = {
      getName(name) {
        console.log('person.getName called with', name);
      },
      getLastname(lastname) {
        console.log('person.getLastname called with', lastname);
      }
    }

    cy.spy(person, 'getName').as('getName');
    cy.spy(person, 'getLastname').as('getLastname');

    setTimeout(() => {
      person.getName('taohuh');
    }, 1000);

    setTimeout(() => {
      person.getLastname('MAQE');
    }, 2000);

    cy.get('@getName').should('have.been.calledOnce')
    cy.get('@getLastname').should('have.been.calledOnce')
  })

  it('cy.stub() - create a stub and/or replace a function with stub', () => {
    // https://on.cypress.io/stub
    cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')

    const obj = {
      /**
       * prints both arguments to the console
       * @param a {string}
       * @param b {string}
      */
      foo (a, b) {
        console.log('a', a, 'b', b)
      },
    }

    const stub = cy.stub(obj, 'foo').as('foo')

    obj.foo('I am a', 'I am b')

    expect(stub).to.be.called
  })

  it('cy.clock() - control time in the browser', () => {
    // https://on.cypress.io/clock

    // create the date in UTC so its always the same
    // no matter what local timezone the browser is running in
    const now = new Date(Date.UTC(2017, 2, 14)).getTime()

    cy.clock(now)
    cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')
    cy.get('#clock-div').click()
      .should('have.text', '1489449600')
  })

  it('cy.tick() - move time in the browser', () => {
    // https://on.cypress.io/tick

    // create the date in UTC so its always the same
    // no matter what local timezone the browser is running in
    const now = new Date(Date.UTC(2017, 2, 14)).getTime()

    cy.clock(now)
    cy.visit('https://example.cypress.io/commands/spies-stubs-clocks')
    cy.get('#tick-div').click()
      .should('have.text', '1489449600')
    cy.tick(10000) // 10 seconds passed
    cy.get('#tick-div').click()
      .should('have.text', '1489449610')
  })

  describe('URL Schema Test', () => {
    beforeEach(() => {
      cy.visit('./url-schema.html')
    })

    it.only('it should click to navigate', () => {
      // replacerFn
      const mySetLocationHref = (url) => {
        expect(url).to.eq('adafsd')
      }

      cy.window().then((win) => {
        cy.stub(win, 'setLocationHref', mySetLocationHref).as('setLocationHref');
      });

      cy.get('[data-cy="link-tel"]').click();

      cy.get('@setLocationHref').should('be.calledOnce')
    })
  })
})
