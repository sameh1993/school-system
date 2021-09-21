

! function ($) {
	$(document).on("click", "ul.nav li.parent > a ", function () {
		$(this).find('em').toggleClass("fa-minus");
	});
	$(".sidebar span.icon").find('em:first').addClass("fa-plus");
}

(window.jQuery);
$(window).on('resize', function () {
	if ($(window).width() > 768) $('#sidebar-collapse').collapse('show')
})
$(window).on('resize', function () {
	if ($(window).width() <= 767) $('#sidebar-collapse').collapse('hide')
})

$(document).on('click', '.panel-heading span.clickable', function (e) {
	var $this = $(this);
	if (!$this.hasClass('panel-collapsed')) {
		$this.parents('.panel').find('.panel-body').slideUp();
		$this.addClass('panel-collapsed');
		$this.find('em').removeClass('fa-toggle-up').addClass('fa-toggle-down');
	} else {
		$this.parents('.panel').find('.panel-body').slideDown();
		$this.removeClass('panel-collapsed');
		$this.find('em').removeClass('fa-toggle-down').addClass('fa-toggle-up');
	}
})

/* add student page  */

$(document).ready(function () {

	$(".container-form .image-container .image").change(function (e) {
		console.log(e.target.files[0].name)
		$(".tagImage").attr("src", URL.createObjectURL(e.target.files[0])).addClass("preview");
	})

	// calculate student age
	// $("form .date").blur(function () {

	// 	const mydate = $(this).val().split("-")

	// 	var diff_ms = new Date(new Date().getFullYear(), 10, 1) - new Date(mydate[2], mydate[1], mydate[0]).getTime();
	// 	var age_dt = new Date(diff_ms);

	// 	alert(Math.abs(age_dt.getUTCFullYear() - 1970))
	// }	)

	$(".fixed").hide()
	$(".fixed .fa-window-close").click(function () {
		$(this).parent(".fixed").hide()
	})

	$(".links li").click(function () {
		$("." + $(this).data('show')).fadeIn(400)
	})

	$(".edit").click(function (a) {

		a.preventDefault()
		const parent = $(this).parents('tr')
		const ourObj = {
			ssn: +parent.find('.ssn').val(),
			subjectId: +parent.find('.subjectId').val(),
			workFTerm: +parent.find(".works_f_term").val(),
			ftermdegree: +parent.find('.f_term_degree').val()
		}
		axios.post("/exam/first-term/add-degree", ourObj).then(resault => {
			parent.find('.resault').html( ourObj.ftermdegree + ourObj.workFTerm )
		}).catch(err => {
			console.log(err)
		})

	})

	$(".add-term-degrees").click(function (e) {
		e.preventDefault()

		const parent = $(this).parents('tr')
		const ourObj = {
			ssn: +parent.find('.ssn').val(),
			subjectId: +parent.find('.subjectId').val(),
			worklTerm: +parent.find(".works_l_term").val(),
			ltermdegree: +parent.find('.l_term_degree').val()
		}

		const exam_degree = +parent.find(".exam_degree").val()
		const success_parcent = +parent.find(".success_parcent").val()
		axios.post("/exam/last-term/add-degree", ourObj).then(resault => {
			parent.find('.resault').html(resault.data.total_resault)
			if(ourObj.ltermdegree <= (exam_degree * success_parcent) / 100 ) {
				parent.find('.l_term_degree').addClass("error")
			} else {
				parent.find('.l_term_degree').removeClass("error")
			}
			console.log( exam_degree + " " + success_parcent)
		}).catch(err => {
			console.log(err)
		})
	})


	$(".preview > *").click(function () {
		$(this).parents(".preview").hide()
	})

	$('#calendar').datepicker({});
})