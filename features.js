function process(doc,text) {
	var d = doc.implementation.createHTMLDocument("New Document");
	d.documentElement.innerHTML=text;
  // implement some features for articles: sidenotes, number_sections, toc

  var config = [], toc_title = 'Contents', makeArray = function(x) {
    return x instanceof Array ? x : (x === null ? [] : [x]);
  };
  // if (d.currentScript) {
  //   config = d.currentScript.dataset['pageFeatures'];
  //   config = config ? JSON.parse(config) : [];
  //   // local c1 to override global config c2
  //   var c1 = makeArray(config[0]), c2 = makeArray(config[1]);
  //   if (c1.length > 0) c2.forEach(function(x) {
  //     x1 = x.replace(/^[+-]/, '');
  //     var found = false;
  //     c1.forEach(function(x2) {
  //       if (found) return;
  //       found = x2.replace('/^[+-]/', '') == x1;
  //     });
  //     !found && c1.push(x);
  //   });
  //   c3 = config[2];  // toc title
  //   if (c3) toc_title = c3;
  //   config = c1;
  // }

  var removeEl = function(el) {
    if (!el) return;
    el.remove ? el.remove() : el.parentNode.removeChild(el);
  };

  var insertAfter = function(target, sib) {
    target.after ? target.after(sib) : (
      target.parentNode.insertBefore(sib, target.nextSibling)
    );
  };
  var insertBefore = function(target, sib) {
    target.before ? target.before(sib) : (
      target.parentNode.insertBefore(sib, target)
    );
  };

  // <a><b>c</b></a> -> <b><a>c</a></b>
  var insideOut = function(el) {
    var p = el.parentNode, x = el.innerHTML,
      c = document.createElement('div');  // a tmp container
    insertAfter(p, c);
    c.appendChild(el);
    el.innerHTML = '';
    el.appendChild(p);
    p.innerHTML = x;  // let the original parent have the content of its child
    insertAfter(c, c.firstElementChild);
    removeEl(c);
  }

  var i, a, s;

  // process single articles
  var article = d.querySelector('main .article');
  if (!article) article = d.createElement('div');

  // move <figcaption> out of <figure> (and p.caption out of div.figure) so that <figure> can scroll
  d.querySelectorAll('.fullscroll figure > figcaption, .fullscroll .figure > .caption').forEach(function(el) {
    insertAfter(el.parentNode, el);
  });

  // move footnotes and citations to sidenotes
  if (true) {
    d.querySelectorAll('.footnotes > ol > li[id^="fn"], #refs > div[id^="ref-"]').forEach(function(fn) {
      a = d.querySelectorAll('a[href="#' + fn.id + '"]');  // <a> that points to note id in body
      if (a.length === 0) return;
      a.forEach(function(el) { el.removeAttribute('href') });
      a = a[0];
      s = d.createElement('div');  // insert a side div next to n in body
      s.className = 'side side-right';
      if (/^fn/.test(fn.id)) {
				console.log(fn.id);
        s.innerHTML = fn.innerHTML;
        var n = a.innerText;   // footnote number
        s.firstElementChild.innerHTML = '<span class="bg-number">' + n +
          '</span> ' + s.firstElementChild.innerHTML;
        removeEl(s.querySelector('a[href^="#fnref"]'));  // remove backreference
        a.parentNode.tagName === 'SUP' && insideOut(a);
      } else {
        s.innerHTML = fn.outerHTML;
        a = a.parentNode;
      }
      // insert note after the <sup> or <span> that contains a
      insertAfter(a, s);
      a.classList.add('note-ref');
      removeEl(fn);
    });
    // remove the footnote/citation section if it's empty now
    d.querySelectorAll('.footnotes, #refs').forEach(function(fn) {
      var items = fn.children;
      if (fn.id === 'refs') return items.length === 0 && removeEl(fn);
      // there must be a <hr> and an <ol> left
      if (items.length !== 2 || items[0].tagName !== 'HR' || items[1].tagName !== 'OL') return;
      items[1].childElementCount === 0 && removeEl(fn);
    });
  }
	// var blob = new Blob(['<main>\n'+d.querySelector('main').innerHTML+'</main>'], {type: "text/plain;charset=utf-8"});
  // saveAs(blob, "save.html");
	return ['<main>\n'+d.querySelector('main').innerHTML+'</main>'];
};
