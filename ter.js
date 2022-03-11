jQuery(document).ready(function ($) {
  figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
  figlet.preloadFonts(["Standard", "Alpha", "Broadway", "Isometric1"], ready);
  var path = ['/posts','/'];
	var files=[];
	var term;
	function getQueryString(a, name) {
    var myURL = new URL(a.toString());
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = myURL.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  };
	var apps={
		pass: function () {
			this.set_mask("-")
				.read("pass: ")
				.then((pass) => this.echo("Your password is " + pass));
		},
		// set: function (new_path) {
		// 	path = new_path;
		// },
		read: function (filename) {
			// if(files[filename]){
			if(filename){
				if(files[filename]){
					url="./posts" + files[filename];
					console.log(path[path.length-1]);
					var patt = /\/post\/.+/;
					if(patt.test(url)){
					$.ajax({
						url: url ,
						async: false,
						success: function (result) {
							term.clear();
							content = process(document, result);
							term.echo(content, { raw: true });
							MathJax.Hub.Typeset();
							// term.pause();
						},
						error: function (jqXHR, textStatus, errorThrown) {
							term.echo("[[b;#A00;]Error]:" + errorThrown);
						},
					});
				}else{
					term.echo("[[b;#A00;]Error]:" + "You can't read it!");
				}
				}else{
					term.echo("[[b;#A00;]Error]:" + "No Such File!");
				}
			}else {
				var patt = /\/post\/.+/;
				if(patt.test(path[path.length-1])){
					$.ajax({
						url: "." + relpath() ,
						async: false,
						success: function (result) {
							term.clear();
							content = process(document, result);
							term.echo(content, { raw: true });
							MathJax.Hub.Typeset();
							// term.pause();
						},
						error: function (jqXHR, textStatus, errorThrown) {
							term.echo("[[b;#A00;]Error]:" + errorThrown);
						},
					});
				}else{
					term.echo("[[b;#A00;]Error]:" + "You can't read it!");
				}
		}
		
		},
		cd: function (filename) {
			if(filename == ".."){
				if(path.length>1){
					path.pop();
					term.exec('ls #',true);
				}
			}else if(files[filename]!=null){
				path.push(files[filename]);
				term.exec('ls #',true);
				// console.log(path);
			}else{
				term.echo("[[b;#A00;]Error]:" + "No Such File or Dictionary")
			}
		},
		ls: function (filename) {
			// console.log("." + path.join(''));
			var invi=false;
			if(filename == '#'){
				invi=true;
				filename=null;
				console.log(path);
			}
			var patt = /\/post\/.+/;
			if(!patt.test(path[path.length-1])){
				$.ajax({
					url: "." + relpath() + (filename ?(filename+'/'):'')+'index.xml',
					async: false,
					success: function (result) {
						files = []; 
						names = []; 
						var txt = "";
						// term.echo(result);
						// var xmlDoc = parser.parseFromString(result, "text/xml");
					
						x = result.getElementsByTagName('item');
						for (i = 0; i < x.length; i++) {
							txt +=
								x[i].childNodes[1].childNodes[0].nodeValue+ "<br>";
							files[x[i].childNodes[1].childNodes[0].nodeValue]=decodeURI(x[i].childNodes[3].childNodes[0].nodeValue);
							// names.push(x[i].childNodes[1].childNodes[0].nodeValue);
							// names
							// txt +=
							// decodeURI(x[i].childNodes[3].childNodes[0].nodeValue)+ "<br>";
							// console.log(	x[i].childNodes[3]);
						}
						if(!invi){
							term.echo(txt, { raw: true });
						}
						// console.log(names);
						// term.pause();
					},
					error: function (jqXHR, textStatus, errorThrown) {
						term.echo("[[b;#A00;]Error]:" + errorThrown);
						// console.log(path);
					},
				});
			}
		},
		search: function (keyword) {
			// console.log("." + path.join(''));
			$.getJSON("./posts/index.json", function(data) {
				const options = {
					includeScore: true,
					keys: ['content', 'title']
				};
				const fuse = new Fuse(data, options);
				const result = fuse.search(keyword);
				for (var ans of result) {
					// console.log(ans);
					term.echo(ans.item.title,{raw:true});
					files[ans.item.title]=decodeURI(ans.item.uri);
				}
		});
		},
		process: function (filename) {
			$.ajax({
				url: "." + relpath() + "/" + filename,
				async: false,
				success: function (result) {
					term.clear();
					term.echo(result, { raw: true });
					term.echo('<script src="features.js"></script>', { raw: true });
					term.clear();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					term.echo("[[b;#A00;]Error]:" + errorThrown);
				},
				
			});
			// var div = $('<h1>Hello <strong>World</strong></h1>\n <div class="mathjax"> $asd$ </div>')
		},
		randsong: function(){
			$.getJSON("./posts/songs.json", function(data) {
				var entry = data[Math.round(Math.random() * data.length)];
      term.echo(
        '<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=' +
          getQueryString(entry[2], "id") +
          '&auto=0&height=66"></iframe>' ,{raw:true}
      );
		});
		},
		typeset: function () {
			MathJax.Hub.Typeset();
		},
		cls: function () {
			term.clear();
		},
		logo: function () {
			this.echo(() => bre(this, "_", "blue"), { raw: true });
			this.echo(() => render(this, "Edward", "Alpha", "red"), {
				raw: true,
			});
			this.echo(() => render(this, "Kerman", "Alpha", "green"), {
				raw: true,
			});
			this.echo(() => bre(this, "_", "blue"), { raw: true });
		},
		cat: function () {
			this.echo(() => render(this, "Catagories", "Isometric1", "blue"), {
				raw: true,
			});
		},
	}
	// var apps = ['ls','read','logo','process'];
	function relpath(){
		return path[0]+path[path.length-1]
	}
  function ready() {
    term = $("#ter").terminal(
      apps,
      {
        checkArity: false,
        completion: true,
        mousescroll: true,
        ignoreSystemDescribe: true,
        name: "Edward Kerman's shell",
        greetings: false,
        onInit() {
          this.echo(() => render(this, "Edward", "Alpha", "red"), {
            raw: true,
          });
          this.echo(() => render(this, "Kerman", "Alpha", "green"), {
            raw: true,
          });
          this.echo(
            "Welcome to " +
              color("red", "[[b;;][[i;;]Edward Kerman]]") +
              "'s shell!"
          );
					this.exec('ls #',true);
        },
				completion: function(string, callback) {
					if (this.get_command().match(/^read /)||this.get_command().match(/^cd /)||this.get_command().match(/^ls /)) {
						callback(Object.keys(files));}
						else{
							callback(Object.keys(apps));
						}
				
					},
        prompt() {
          return `(${color("violet", "[[b;;]guest]@EK")})-[${color(
            "blue",
            relpath()
          )}]\n\$ `;
        },
        // 	keypress: function(e, term) {
        // 		if (e.which == 100 && e.ctrlKey) {
        // 				term.resume();
        // 				return false;
        // 		}
        // },
      }
    );
  }
  function repeat(target, n) {
    var s = target,
      total = "";
    while (n > 0) {
      if (n % 2 == 1) {
        total += s;
      }
      if (n == 1) {
        break;
      }

      s += s;
      n = n >> 1; //相当于将n除以2取其商，或者说是开2次方
    }
    return total;
  }
  function bre(term, text, col) {
    const cols = Math.round(term.cols() / text.length);
    return (
      '<font color="' +
      col +
      '" weight="bold">' +
      repeat(text, cols) +
      "</font>"
    );
  }
  function render(term, text, font, col) {
    const cols = term.cols();
    return (
      '<pre><font color="' +
      col +
      '">' +
      figlet.textSync(text, {
        font: font || "Standard",
        width: cols,
        whitespaceBreak: true,
      }) +
      "</font></pre>"
    );
  }
  function color(name, string) {
    var colors = {
      blue: "#55f",
      green: "#4d4",
      grey: "#999",
      red: "#A00",
      yellow: "#FF5",
      violet: "#a320ce",
      white: "#fff",
    };
    if (colors[name]) {
      return "[[;" + colors[name] + ";]" + string + "]";
    } else {
      return string;
    }
  }

  // 			window.onresize = function () {
  // 				term.resize([$(window).width() * 0.8,$(window).height());
  // 				// alert();
  // }
});
// 	$(window).resize(function(){
// 		// term.resize([$(window).width() * 0.8,$(window).height()]);
// 		term.resize([$(window).width() * 0.8,$(window).height()]);
//  });
