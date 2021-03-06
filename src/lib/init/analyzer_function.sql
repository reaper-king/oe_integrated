-- FUNCTION: clinlims.data_import(analyzer_name text , sample_id text , tests text , results text)

 DROP FUNCTION IF EXISTS clinlims.data_import(analyzer_name text , sample_id text , tests text , results text);

CREATE OR REPLACE FUNCTION clinlims.data_import(analyzer_name text , sample_id text , tests text , results text  )
    RETURNS text
    LANGUAGE 'plpgsql'
AS $BODY$
DECLARE 
		v_first_id integer := nextval('analyzer_results_seq');
		v_second_id integer := nextval('analyzer_results_seq');
		v_third_id integer := nextval('analyzer_results_seq');
		v_analyzer_id integer := (select distinct analyzer_id from analyzer_v where analyzer = analyzer_name );
		v_test_id integer := (select distinct test_id::int from analyzer_v where analyzer_id = v_analyzer_id and analyzer_test_name = tests );
		v_tr_type text := (select distinct test_result_type::text from analyzer_v where analyzer_id = v_analyzer_id  and test_id = v_test_id);
		v_created  TIMESTAMP  WITHOUT TIME ZONE := now();
		v_org_result text := results;
 		v_result text := (select
							case 
							when v_tr_type in ('A','R','N')
							then v_org_result::text
							else  (select distinct  result::text from analyzer_v where analyzer_id = v_analyzer_id and test_id = v_test_id and dict_entry = v_org_result  )
							end ); 
BEGIN 

  	insert into analyzer_results 
	(id,analyzer_id,accession_number,test_name,result,status_id, lastupdated,read_only,duplicate_id,complete_date,test_result_type,test_id) values 
  	(v_first_id,v_analyzer_id,sample_id,tests,v_result,1,v_created, false ,v_third_id,v_created,v_tr_type,v_test_id) ;
    insert into analyzer_results (id,analyzer_id,accession_number,test_name,result,status_id, lastupdated,read_only,duplicate_id,complete_date,test_result_type,test_id) values 
  	(v_second_id,v_analyzer_id,sample_id,tests,v_result,1,v_created, true ,v_first_id,v_created,v_tr_type,v_test_id) ;
	insert into analyzer_results (id,analyzer_id,accession_number,test_name,result,status_id, lastupdated,read_only,duplicate_id,complete_date,test_result_type,test_id) values 
  	(v_third_id,v_analyzer_id,sample_id,tests,v_result,1,v_created, true ,v_first_id,v_created,v_tr_type,v_test_id) ;



	return 'ok ';



    exception 
    when others then
        return 'Error Name: '|| SQLERRM ||' \nError State: '|| SQLSTATE ;
	
END;

$BODY$;

ALTER FUNCTION clinlims.data_import(analyzer_name text , sample_id text , tests text , results text)
    OWNER TO clinlims;
